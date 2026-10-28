import { Router } from 'express';
import {
  getAdminStats,
  getAllBookings,
  createMovie,
  updateMovie,
  deleteMovie,
  createShow,
  deleteShow
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/bookings', getAllBookings);
router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);
router.post('/shows', createShow);
router.delete('/shows/:id', deleteShow);

export default router;
