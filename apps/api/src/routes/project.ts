import { Router } from 'express';
import {
  submitProject,
  getProjectsForHackathon,
  getAllProjects,
} from '../controllers/projectController';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllProjects);
router.get('/hackathon/:hackathon_id', getProjectsForHackathon);

// Protected route to submit a project
router.post('/', protect, submitProject);


export default router;
