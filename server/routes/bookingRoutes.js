import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById, cancelBooking } from '../controllers/bookingController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/my', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);
router.post('/:id/cancel', requireAuth, cancelBooking);

export default router;
