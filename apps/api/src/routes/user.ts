import { Router } from 'express';
import {
  getMyRegistrations,
  getMyProjects,
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

// All routes in this file are protected
router.use(protect);

router.get('/me/registrations', getMyRegistrations);
router.get('/me/projects', getMyProjects);

export default router;
