import { Router } from 'express';
import {
  getAllHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  registerForHackathon,
} from '../controllers/hackathonController';
import { protect, hasRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllHackathons);
router.get('/:id', getHackathonById);

// Organizer routes
router.post(
  '/',
  protect,
  hasRole(['ORGANIZER', 'SUPERADMIN']),
  createHackathon
);
router.put(
  '/:id',
  protect,
  hasRole(['ORGANIZER', 'SUPERADMIN']),
  updateHackathon
);
router.delete(
  '/:id',
  protect,
  hasRole(['ORGANIZER', 'SUPERADMIN']),
  deleteHackathon
);

// User routes
router.post(
  '/register',
  protect,
  hasRole(['USER', 'ORGANIZER', 'SUPERADMIN']),
  registerForHackathon
);

export default router;
