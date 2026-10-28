import { db } from '../db/store.js';

export function getAdminStats(req, res) {
  try {
    const stats = db.getAdminMetrics();
    const bookings = db.getAllBookings();
    res.json({ stats, recentBookings: bookings.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve admin analytics' });
  }
}

export function getAllBookings(req, res) {
  try {
    const bookings = db.getAllBookings();
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve all bookings' });
  }
}

export function createMovie(req, res) {
  try {
    const {
      title,
      tagline,
      description,
      posterUrl,
      backdropUrl,
      genre,
      durationMinutes,
      releaseDate,
      language,
      rating,
      certification,
      cast,
      director,
      trailerUrl,
      status
    } = req.body;

    if (!title || !description) {
      res.status(400).json({ message: 'Movie title and description are required' });
      return;
    }

    const newMovie = {
      id: `mov_${Date.now()}`,
      title,
      tagline: tagline || '',
      description,
      posterUrl: posterUrl || '/client/src/assets/images/hero_cinema_interstellar_1793178113951.jpg',
      backdropUrl: backdropUrl || posterUrl || '/client/src/assets/images/hero_cinema_interstellar_1793178113951.jpg',
      genre: Array.isArray(genre) ? genre : (genre ? [genre] : ['Drama']),
      durationMinutes: Number(durationMinutes) || 120,
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      language: language || 'English',
      rating: Number(rating) || 8.5,
      certification: certification || 'PG-13',
      cast: Array.isArray(cast) ? cast : (cast ? cast.split(',').map((c) => c.trim()) : []),
      director: director || 'Director',
      trailerUrl: trailerUrl || 'https://www.youtube.com',
      status: status || 'now_showing',
      createdAt: new Date().toISOString()
    };

    const saved = db.createMovie(newMovie);
    res.status(201).json({ message: 'Movie created successfully', movie: saved });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create movie' });
  }
}

export function updateMovie(req, res) {
  try {
    const updated = db.updateMovie(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }
    res.json({ message: 'Movie updated successfully', movie: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update movie' });
  }
}

export function deleteMovie(req, res) {
  try {
    const success = db.deleteMovie(req.params.id);
    if (!success) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }
    res.json({ message: 'Movie and associated shows deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete movie' });
  }
}

export function createShow(req, res) {
  try {
    const { movieId, theatreId, screenNumber, date, startTime, endTime, format, pricing } = req.body;

    if (!movieId || !theatreId || !date || !startTime) {
      res.status(400).json({ message: 'Movie, theatre, date, and startTime are required' });
      return;
    }

    const movie = db.getMovieById(movieId);
    const theatre = db.getTheatreById(theatreId);

    if (!movie || !theatre) {
      res.status(404).json({ message: 'Movie or Theatre not found' });
      return;
    }

    const newShow = {
      id: `sh_${Date.now()}`,
      movieId,
      theatreId,
      screenNumber: Number(screenNumber) || 1,
      date,
      startTime,
      endTime: endTime || '22:00',
      format: format || 'IMAX 3D',
      pricing: pricing || { standard: 240, premium: 340, vip: 500 },
      totalSeats: 64,
      availableSeats: 64
    };

    const created = db.createShow(newShow);
    res.status(201).json({ message: 'Showtime scheduled successfully', show: created });
  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule showtime' });
  }
}

export function deleteShow(req, res) {
  try {
    const success = db.deleteShow(req.params.id);
    if (!success) {
      res.status(404).json({ message: 'Show not found' });
      return;
    }
    res.json({ message: 'Showtime cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete showtime' });
  }
}
