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

// Get a user's public profile data
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const userQuery = query(`
            SELECT id, wallet_address,
            CASE
                WHEN email IS NOT NULL THEN SPLIT_PART(email, '@', 1) || '@...'
                ELSE NULL
            END as masked_email
            FROM users WHERE id = $1`, [id]);

        const rolesQuery = query(`
            SELECT r.name FROM roles r
            JOIN user_roles ur ON r.id = ur.role_id
            WHERE ur.user_id = $1`, [id]);

        const projectsQuery = query('SELECT * FROM projects WHERE created_by_user_id = $1', [id]);

        const registeredHackathonsQuery = query(`
            SELECT h.* FROM hackathons h
            JOIN registrations r ON h.id = r.hackathon_id
            WHERE r.user_id = $1`, [id]);

        const organizedHackathonsQuery = query(`
            SELECT h.* FROM hackathons h
            JOIN organizations o ON h.organization_id = o.id
            WHERE o.owner_id = $1`, [id]);

        const [
            userResult,
            rolesResult,
            projectsResult,
            registeredHackathonsResult,
            organizedHackathonsResult
        ] = await Promise.all([
            userQuery,
            rolesQuery,
            projectsQuery,
            registeredHackathonsQuery,
            organizedHackathonsQuery
        ]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: userResult.rows[0],
            roles: rolesResult.rows.map(r => r.name),
            projects: projectsResult.rows,
            registeredHackathons: registeredHackathonsResult.rows,
            organizedHackathons: organizedHackathonsResult.rows
        });

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
