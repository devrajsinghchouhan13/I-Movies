import { db } from '../db/store.js';

export function getShows(req, res) {
  try {
    const { movieId, theatreId, date } = req.query;
    const shows = db.getShows({
      movieId,
      theatreId,
      date
    });
    res.json({ shows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve shows' });
  }
}

export function getShowDetails(req, res) {
  try {
    const show = db.getShowById(req.params.id);
    if (!show) {
      res.status(404).json({ message: 'Show not found' });
      return;
    }

    const movie = db.getMovieById(show.movieId);
    const theatre = db.getTheatreById(show.theatreId);
    const seats = db.getSeatsForShow(show.id);

    res.json({
      show,
      movie,
      theatre,
      seats
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve show seat layout' });
  }
}

export function lockSeats(req, res) {
  try {
    const { showId, seatNumbers } = req.body;
    const userId = req.user?.id || 'guest_user';

    if (!showId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      res.status(400).json({ message: 'Show ID and at least one seat number are required' });
      return;
    }

    const result = db.lockSeats(showId, seatNumbers, userId, 300);
    if (!result.success) {
      res.status(409).json({ message: result.error });
      return;
    }

    res.json({
      message: 'Seats locked for 5 minutes',
      expiresInSeconds: 300,
      seats: result.seats
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to lock seats' });
  }
}

export function unlockSeats(req, res) {
  try {
    const { showId, seatNumbers } = req.body;
    const userId = req.user?.id || 'guest_user';

    if (!showId || !Array.isArray(seatNumbers)) {
      res.status(400).json({ message: 'Show ID and seat numbers required' });
      return;
    }

    db.unlockSeats(showId, seatNumbers, userId);
    res.json({ message: 'Seats released successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unlock seats' });
  }
}
