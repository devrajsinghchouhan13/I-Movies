import { db } from '../db/store.js';

function generateBookingRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const num = Math.floor(1000 + Math.random() * 9000);
  return `IMV-${num}-${rand}`;
}

export function createBooking(req, res) {
  try {
    const userId = req.user?.id;
    const userName = req.user?.name || 'Guest Cinema Fan';
    const userEmail = req.user?.email || 'guest@imovies.com';

    if (!userId) {
      res.status(401).json({ message: 'Authentication required to complete ticket reservation' });
      return;
    }

    const { showId, seats, paymentMethod, cardLast4 } = req.body;

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      res.status(400).json({ message: 'Show and seat selections are required' });
      return;
    }

    const show = db.getShowById(showId);
    if (!show) {
      res.status(404).json({ message: 'Showtime not found' });
      return;
    }

    const movie = db.getMovieById(show.movieId);
    const theatre = db.getTheatreById(show.theatreId);

    if (!movie || !theatre) {
      res.status(404).json({ message: 'Movie or Theatre details not found' });
      return;
    }

    const bookingSeats = seats.map((s) => ({
      seatNumber: s.seatNumber,
      row: s.row,
      tier: s.tier,
      price: s.price || (s.tier === 'vip' ? show.pricing.vip : s.tier === 'premium' ? show.pricing.premium : show.pricing.standard)
    }));

    const subtotal = bookingSeats.reduce((sum, s) => sum + s.price, 0);
    const convenienceFee = Number((bookingSeats.length * 25).toFixed(2));
    const tax = Number((subtotal * 0.18).toFixed(2));
    const totalAmount = Number((subtotal + convenienceFee + tax).toFixed(2));

    const bookingReference = generateBookingRef();
    const paymentId = `pay_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const newBooking = {
      id: `bk_${Date.now()}`,
      bookingReference,
      userId,
      userName,
      userEmail,
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.posterUrl,
      theatreId: theatre.id,
      theatreName: theatre.name,
      theatreLocation: `${theatre.location}, ${theatre.city}`,
      screenNumber: show.screenNumber,
      showId: show.id,
      showDate: show.date,
      showTime: show.startTime,
      format: show.format,
      seats: bookingSeats,
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
      payment: {
        paymentId,
        method: paymentMethod || 'credit_card',
        amount: totalAmount,
        status: 'completed',
        timestamp: new Date().toISOString(),
        cardLast4: cardLast4 || '8839'
      },
      status: 'confirmed',
      qrCodeData: `IMOVIES|${bookingReference}|${movie.id}|SHOW:${show.id}|SEATS:${bookingSeats.map(s => s.seatNumber).join(',')}`,
      createdAt: new Date().toISOString()
    };

    const result = db.createBooking(newBooking);
    if (!result.success) {
      res.status(409).json({ message: result.error });
      return;
    }

    res.status(201).json({
      message: 'Tickets booked successfully!',
      booking: result.booking
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete booking transaction' });
  }
}

export function getMyBookings(req, res) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const bookings = db.getBookingsByUser(req.user.id);
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
}

export function getBookingById(req, res) {
  try {
    const booking = db.getBookingById(req.params.id);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (req.user && req.user.role !== 'admin' && booking.userId !== req.user.id) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch booking details' });
  }
}

export function cancelBooking(req, res) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { reason } = req.body;
    const result = db.cancelBooking(req.params.id, req.user.id, reason);

    if (!result.success) {
      res.status(400).json({ message: result.error });
      return;
    }

    res.json({
      message: 'Booking cancelled successfully. Refund initiated.',
      booking: result.booking
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
}
