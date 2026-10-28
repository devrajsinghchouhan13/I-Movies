import { db } from '../db/store.js';

export function getMovies(req, res) {
  try {
    const { genre, language, search, status } = req.query;
    const movies = db.getMovies({
      genre,
      language,
      search,
      status
    });
    res.json({ movies, total: movies.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve movies' });
  }
}

export function getMovieById(req, res) {
  try {
    const movie = db.getMovieById(req.params.id);
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }
    const shows = db.getShows({ movieId: movie.id });
    res.json({ movie, shows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve movie details' });
  }
}

export function getFeaturedMovies(req, res) {
  try {
    const all = db.getMovies();
    const featured = all.filter((m) => m.status === 'featured' || m.rating >= 9.0);
    res.json({ movies: featured });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve featured movies' });
  }
}
