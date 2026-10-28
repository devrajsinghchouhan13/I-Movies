import { db } from '../db/store.js';

export function getTheatres(req, res) {
  try {
    const theatres = db.getTheatres();
    res.json({ theatres });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve theatres' });
  }
}

export function getTheatreById(req, res) {
  try {
    const theatre = db.getTheatreById(req.params.id);
    if (!theatre) {
      res.status(404).json({ message: 'Theatre not found' });
      return;
    }
    const shows = db.getShows({ theatreId: theatre.id });
    res.json({ theatre, shows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve theatre' });
  }
}
