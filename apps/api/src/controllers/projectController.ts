import { Response } from 'express';
import { query } from '../db';
import { AuthRequest } from '../middleware/auth';

// Submit a project to a hackathon
export const submitProject = async (req: AuthRequest, res: Response) => {
  const { name, description, github_url, hackathon_id } = req.body;
  const userId = req.user?.userId;

  if (!name || !hackathon_id) {
    return res.status(400).json({ message: 'Project name and hackathon ID are required' });
  }

  try {
    // 1. Verify the user is registered for the hackathon
    const registration = await query(
      'SELECT * FROM registrations WHERE user_id = $1 AND hackathon_id = $2',
      [userId, hackathon_id]
    );

    if (registration.rows.length === 0) {
      return res.status(403).json({ message: 'You must be registered for the hackathon to submit a project.' });
    }

    // Use a transaction to ensure both project and submission are created
    await query('BEGIN');

    // 2. Create the new project
    const newProject = await query(
      'INSERT INTO projects (name, description, github_url, created_by_user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, github_url, userId]
    );
    const projectId = newProject.rows[0].id;

    // 3. Create the submission entry
    const newSubmission = await query(
      'INSERT INTO submissions (project_id, hackathon_id) VALUES ($1, $2) RETURNING *',
      [projectId, hackathon_id]
    );

    await query('COMMIT');

    res.status(201).json({
      message: 'Project submitted successfully',
      project: newProject.rows[0],
      submission: newSubmission.rows[0],
    });

  } catch (error: any) {
    await query('ROLLBACK');
    // Handle unique constraint violation for submission
    if (error.code === '23505') {
        return res.status(409).json({ message: 'This project has already been submitted to this hackathon.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all projects, newest first
export const getAllProjects = async (req: AuthRequest, res: Response) => {
    try {
        const projects = await query('SELECT * FROM projects ORDER BY created_at DESC');
        res.status(200).json(projects.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all projects for a given hackathon
export const getProjectsForHackathon = async (req: AuthRequest, res: Response) => {
    const { hackathon_id } = req.params;
    try {
        const projects = await query(
            `SELECT p.* FROM projects p
             JOIN submissions s ON p.id = s.project_id
             WHERE s.hackathon_id = $1`,
            [hackathon_id]
        );
        res.status(200).json(projects.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
