import fs from 'fs';
import path from 'path';
import { SEED_USERS, SEED_MOVIES, SEED_THEATRES, SEED_SHOWS, SEED_BOOKINGS, generateScreenSeats } from './seed.js';

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

class DatabaseStore {
  constructor() {
    this.data = this.loadOrSeed();
  }

  loadOrSeed() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.cleanExpiredLocks(parsed.showSeats || {});
        return parsed;
      }
    } catch (err) {
      console.warn('Could not read existing db.json, generating fresh seed data.', err);
    }

    const initialShowSeats = {};
    SEED_SHOWS.forEach((show) => {
      initialShowSeats[show.id] = generateScreenSeats(show.pricing);
    });

    const initialData = {
      users: [...SEED_USERS],
      movies: [...SEED_MOVIES],
      theatres: [...SEED_THEATRES],
      shows: [...SEED_SHOWS],
      bookings: [...SEED_BOOKINGS],
      notifications: [
        {
          id: 'notif_1',
          userId: 'usr_demo_1',
          title: 'Booking Confirmed!',
          message: 'Your tickets for Chhaava: The Great Warrior have been reserved. Reference: IMV-8392-OR',
          type: 'booking',
          read: false,
          createdAt: new Date().toISOString()
        }
      ],
      showSeats: initialShowSeats
    };

    this.persist(initialData);
    return initialData;
  }

  persist(dataToSave = this.data) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file', err);
    }
  }

  cleanExpiredLocks(showSeats) {
    const now = new Date().toISOString();
    Object.values(showSeats).forEach((seats) => {
      seats.forEach((seat) => {
        if (seat.status === 'locked' && seat.lockedUntil && seat.lockedUntil < now) {
          seat.status = 'available';
          delete seat.lockedByUserId;
          delete seat.lockedUntil;
        }
      });
    });
  }

  // === Users ===
  findUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(user) {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  // === Movies ===
  getMovies(query) {
    let result = [...this.data.movies];

    if (query?.status) {
      result = result.filter((m) => m.status === query.status);
    }
    if (query?.genre && query.genre !== 'All') {
      result = result.filter((m) => m.genre.some((g) => g.toLowerCase() === query.genre?.toLowerCase()));
    }
    if (query?.language && query.language !== 'All') {
      result = result.filter((m) => m.language.toLowerCase().includes(query.language.toLowerCase()));
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some((c) => c.toLowerCase().includes(q))
      );
    }

    return result;
  }

  getMovieById(id) {
    return this.data.movies.find((m) => m.id === id);
  }

  createMovie(movie) {
    this.data.movies.push(movie);
    this.persist();
    return movie;
  }

  updateMovie(id, updates) {
    const index = this.data.movies.findIndex((m) => m.id === id);
    if (index === -1) return null;
    this.data.movies[index] = { ...this.data.movies[index], ...updates };
    this.persist();
    return this.data.movies[index];
  }

  deleteMovie(id) {
    const prevLen = this.data.movies.length;
    this.data.movies = this.data.movies.filter((m) => m.id !== id);
    if (this.data.movies.length !== prevLen) {
      this.data.shows = this.data.shows.filter((s) => s.movieId !== id);
      this.persist();
      return true;
    }
    return false;
  }

  // === Theatres ===
  getTheatres() {
    return this.data.theatres;
  }

  getTheatreById(id) {
    return this.data.theatres.find((t) => t.id === id);
  }

  // === Shows & Seats ===
  getShows(filter) {
    let result = [...this.data.shows];
    if (filter?.movieId) result = result.filter((s) => s.movieId === filter.movieId);
    if (filter?.theatreId) result = result.filter((s) => s.theatreId === filter.theatreId);
    if (filter?.date) result = result.filter((s) => s.date === filter.date);
    return result;
  }

  getShowById(id) {
    return this.data.shows.find((s) => s.id === id);
  }

  createShow(show) {
    this.data.shows.push(show);
    this.data.showSeats[show.id] = generateScreenSeats(show.pricing);
    this.persist();
    return show;
  }

  deleteShow(id) {
    const prev = this.data.shows.length;
    this.data.shows = this.data.shows.filter((s) => s.id !== id);
    delete this.data.showSeats[id];
    this.persist();
    return this.data.shows.length !== prev;
  }

  getSeatsForShow(showId) {
    this.cleanExpiredLocks(this.data.showSeats);

    if (!this.data.showSeats[showId]) {
      const show = this.getShowById(showId);
      if (show) {
        this.data.showSeats[showId] = generateScreenSeats(show.pricing);
        this.persist();
      } else {
        return [];
      }
    }
    return this.data.showSeats[showId];
  }

  lockSeats(showId, seatNumbers, userId, holdDurationSeconds = 300) {
    this.cleanExpiredLocks(this.data.showSeats);
    const seats = this.getSeatsForShow(showId);
    if (!seats.length) return { success: false, error: 'Show not found' };

    const unavailable = seats.filter(
      (s) =>
        seatNumbers.includes(s.seatNumber) &&
        (s.status === 'reserved' || (s.status === 'locked' && s.lockedByUserId !== userId))
    );

    if (unavailable.length > 0) {
      return {
        success: false,
        error: `Seats [${unavailable.map((s) => s.seatNumber).join(', ')}] are no longer available.`
      };
    }

    const lockedUntil = new Date(Date.now() + holdDurationSeconds * 1000).toISOString();
    seats.forEach((s) => {
      if (seatNumbers.includes(s.seatNumber)) {
        s.status = 'locked';
        s.lockedByUserId = userId;
        s.lockedUntil = lockedUntil;
      }
    });

    this.persist();
    return { success: true, seats };
  }

  unlockSeats(showId, seatNumbers, userId) {
    const seats = this.data.showSeats[showId];
    if (!seats) return false;

    seats.forEach((s) => {
      if (seatNumbers.includes(s.seatNumber) && s.lockedByUserId === userId) {
        s.status = 'available';
        delete s.lockedByUserId;
        delete s.lockedUntil;
      }
    });

    this.persist();
    return true;
  }

  // === Bookings ===
  createBooking(booking) {
    const seats = this.getSeatsForShow(booking.showId);
    const requestedSeatNumbers = booking.seats.map((s) => s.seatNumber);

    const conflict = seats.some(
      (s) =>
        requestedSeatNumbers.includes(s.seatNumber) &&
        s.status === 'reserved'
    );

    if (conflict) {
      return { success: false, error: 'One or more selected seats were already booked by another user.' };
    }

    seats.forEach((s) => {
      if (requestedSeatNumbers.includes(s.seatNumber)) {
        s.status = 'reserved';
        delete s.lockedByUserId;
        delete s.lockedUntil;
      }
    });

    const show = this.getShowById(booking.showId);
    if (show) {
      show.availableSeats = Math.max(0, show.availableSeats - requestedSeatNumbers.length);
    }

    this.data.bookings.unshift(booking);

    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: booking.userId,
      title: 'Booking Confirmed!',
      message: `Your reservation for "${booking.movieTitle}" at ${booking.theatreName} (${booking.seats.map((s) => s.seatNumber).join(', ')}) is confirmed.`,
      type: 'booking',
      read: false,
      createdAt: new Date().toISOString()
    });

    this.persist();
    return { success: true, booking };
  }

  getBookingsByUser(userId) {
    return this.data.bookings.filter((b) => b.userId === userId);
  }

  getAllBookings() {
    return this.data.bookings;
  }

  getBookingById(id) {
    return this.data.bookings.find((b) => b.id === id || b.bookingReference === id);
  }

  cancelBooking(bookingId, userId, reason) {
    const booking = this.data.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    if (booking.userId !== userId && !this.isAdminUser(userId)) {
      return { success: false, error: 'Unauthorized to cancel this booking' };
    }

    if (booking.status === 'cancelled') {
      return { success: false, error: 'Booking has already been cancelled' };
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date().toISOString();
    booking.cancellationReason = reason || 'Customer requested cancellation';
    booking.refundAmount = booking.totalAmount;
    booking.payment.status = 'refunded';

    const seats = this.data.showSeats[booking.showId];
    if (seats) {
      const seatNums = booking.seats.map((s) => s.seatNumber);
      seats.forEach((s) => {
        if (seatNums.includes(s.seatNumber)) {
          s.status = 'available';
          delete s.lockedByUserId;
          delete s.lockedUntil;
        }
      });
    }

    const show = this.getShowById(booking.showId);
    if (show) {
      show.availableSeats = Math.min(show.totalSeats, show.availableSeats + booking.seats.length);
    }

    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: booking.userId,
      title: 'Booking Cancelled',
      message: `Booking #${booking.bookingReference} has been cancelled. Refund of ₹${booking.totalAmount.toFixed(2)} has been processed.`,
      type: 'cancellation',
      read: false,
      createdAt: new Date().toISOString()
    });

    this.persist();
    return { success: true, booking };
  }

  isAdminUser(userId) {
    const user = this.findUserById(userId);
    return user?.role === 'admin';
  }

  getAdminMetrics() {
    const totalBookings = this.data.bookings.length;
    const confirmedBookings = this.data.bookings.filter((b) => b.status === 'confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + b.seats.length, 0);

    const totalCapacity = this.data.shows.reduce((sum, s) => sum + s.totalSeats, 0);
    const occupancyRate = totalCapacity > 0 ? ((totalTicketsSold / totalCapacity) * 100).toFixed(1) : '0';

    return {
      totalRevenue,
      totalBookings,
      totalTicketsSold,
      occupancyRate: `${occupancyRate}%`,
      activeMovies: this.data.movies.filter((m) => m.status === 'now_showing').length,
      activeTheatres: this.data.theatres.length,
      scheduledShows: this.data.shows.length
    };
  }
}

export const db = new DatabaseStore();
