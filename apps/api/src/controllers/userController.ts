import { Response } from 'express';
import { query } from '../db';
import { AuthRequest } from '../middleware/auth';

// Get all hackathons a user is registered for
export const getMyRegistrations = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  try {
    const registrations = await query(
      `SELECT h.* FROM hackathons h
       JOIN registrations r ON h.id = r.hackathon_id
       WHERE r.user_id = $1`,
      [userId]
    );
    res.status(200).json(registrations.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all projects created by a user
export const getMyProjects = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  try {
    const projects = await query(
      'SELECT * FROM projects WHERE created_by_user_id = $1',
      [userId]
    );
    res.status(200).json(projects.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
