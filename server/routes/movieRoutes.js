import { Router } from 'express';
import { getMovies, getMovieById, getFeaturedMovies } from '../controllers/movieController.js';

const router = Router();

router.get('/', getMovies);
router.get('/featured', getFeaturedMovies);
router.get('/:id', getMovieById);

export default router;
