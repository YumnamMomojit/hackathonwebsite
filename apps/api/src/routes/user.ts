import { Router } from 'express';
import {
  getMyRegistrations,
  getMyProjects,
  getUserProfile,
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

// Public Profile Route
router.get('/:id/profile', getUserProfile);

// Protected 'me' routes
const meRouter = Router();
meRouter.use(protect);
meRouter.get('/registrations', getMyRegistrations);
meRouter.get('/projects', getMyProjects);

router.use('/me', meRouter);


export default router;
