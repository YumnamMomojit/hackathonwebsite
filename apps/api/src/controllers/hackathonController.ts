import { Response } from 'express';
import { query } from '../db';
import { AuthRequest } from '../middleware/auth'; // Assuming AuthRequest is exported from your auth middleware

// Get all hackathons (public)
export const getAllHackathons = async (req: AuthRequest, res: Response) => {
  try {
    const hackathons = await query('SELECT * FROM hackathons ORDER BY start_date DESC');
    res.status(200).json(hackathons.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single hackathon by ID (public)
export const getHackathonById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const hackathon = await query('SELECT * FROM hackathons WHERE id = $1', [id]);
    if (hackathon.rows.length === 0) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.status(200).json(hackathon.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new hackathon (Organizer role required)
export const createHackathon = async (req: AuthRequest, res: Response) => {
  const { name, description, start_date, end_date, prize_pool, organization_id } = req.body;
  const organizerId = req.user?.userId;

  if (!name || !start_date || !end_date || !organization_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // In a real app, you should also verify that the organizerId owns the organization_id
    const newHackathon = await query(
      'INSERT INTO hackathons (name, description, start_date, end_date, prize_pool, organization_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, start_date, end_date, prize_pool, organization_id]
    );
    res.status(201).json(newHackathon.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a hackathon (Organizer role required, and must be owner)
export const updateHackathon = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, start_date, end_date, prize_pool } = req.body;
  const organizerId = req.user?.userId;

  try {
    // First, verify the hackathon exists and the user is the owner of the organization
    const hackathonResult = await query(
        `SELECT h.* FROM hackathons h
         JOIN organizations o ON h.organization_id = o.id
         WHERE h.id = $1 AND o.owner_id = $2`,
        [id, organizerId]
    );

    if (hackathonResult.rows.length === 0) {
        return res.status(404).json({ message: 'Hackathon not found or you are not authorized to update it.' });
    }

    const updatedHackathon = await query(
      'UPDATE hackathons SET name = $1, description = $2, start_date = $3, end_date = $4, prize_pool = $5 WHERE id = $6 RETURNING *',
      [name, description, start_date, end_date, prize_pool, id]
    );

    res.status(200).json(updatedHackathon.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a hackathon (Organizer role required, and must be owner)
export const deleteHackathon = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const organizerId = req.user?.userId;

    try {
      const hackathonResult = await query(
        `SELECT h.* FROM hackathons h
         JOIN organizations o ON h.organization_id = o.id
         WHERE h.id = $1 AND o.owner_id = $2`,
        [id, organizerId]
      );

      if (hackathonResult.rows.length === 0) {
        return res.status(404).json({ message: 'Hackathon not found or you are not authorized to delete it.' });
      }

      await query('DELETE FROM hackathons WHERE id = $1', [id]);
      res.status(204).send(); // No Content
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

// Register a user for a hackathon (User role required)
export const registerForHackathon = async (req: AuthRequest, res: Response) => {
    const { hackathon_id } = req.body;
    const userId = req.user?.userId;

    if (!hackathon_id) {
        return res.status(400).json({ message: 'Hackathon ID is required' });
    }

    try {
        const newRegistration = await query(
            'INSERT INTO registrations (user_id, hackathon_id) VALUES ($1, $2) RETURNING *',
            [userId, hackathon_id]
        );
        res.status(201).json(newRegistration.rows[0]);
    } catch (error: any) {
        // Handle unique constraint violation (user already registered)
        if (error.code === '23505') {
            return res.status(409).json({ message: 'You are already registered for this hackathon.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
