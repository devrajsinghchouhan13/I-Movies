import { Router } from 'express';
import { getShows, getShowDetails, lockSeats, unlockSeats } from '../controllers/showController.js';

const router = Router();

router.get('/', getShows);
router.get('/:id', getShowDetails);
router.post('/lock-seats', lockSeats);
router.post('/unlock-seats', unlockSeats);

export default router;
