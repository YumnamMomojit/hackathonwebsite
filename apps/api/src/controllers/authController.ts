import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { ethers } from 'ethers';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const newUser = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    // Assign the default 'USER' role
    const userRole = await query('SELECT id FROM roles WHERE name = $1', ['USER']);
    if (userRole.rows.length > 0) {
      await query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [
        newUser.rows[0].id,
        userRole.rows[0].id,
      ]);
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getWeb3Challenge = async (req: Request, res: Response) => {
    const { walletAddress } = req.body;

    if (!walletAddress || !ethers.isAddress(walletAddress)) {
        return res.status(400).json({ message: 'Valid wallet address is required' });
    }

    try {
        const challenge = crypto.randomBytes(32).toString('hex');

        // Upsert user and store challenge
        const userResult = await query(
            `INSERT INTO users (wallet_address, auth_challenge)
             VALUES ($1, $2)
             ON CONFLICT (wallet_address)
             DO UPDATE SET auth_challenge = $2
             RETURNING id`,
            [walletAddress, challenge]
        );

        // If this is a new user, assign the 'USER' role
        if (userResult.rows[0]) {
            const userId = userResult.rows[0].id;
            const userRoles = await query('SELECT * FROM user_roles WHERE user_id = $1', [userId]);
            if (userRoles.rows.length === 0) {
                const userRole = await query('SELECT id FROM roles WHERE name = $1', ['USER']);
                if (userRole.rows.length > 0) {
                    await query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [userId, userRole.rows[0].id]);
                }
            }
        }

        res.status(200).json({ challenge });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const web3Login = async (req: Request, res: Response) => {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
        return res.status(400).json({ message: 'Wallet address and signature are required' });
    }

    try {
        // 1. Get the user and their stored challenge
        const userResult = await query('SELECT * FROM users WHERE wallet_address = $1', [walletAddress]);
        if (userResult.rows.length === 0 || !userResult.rows[0].auth_challenge) {
            return res.status(401).json({ message: 'Invalid credentials or no challenge found.' });
        }
        const user = userResult.rows[0];
        const challenge = user.auth_challenge;

        // 2. Verify the signature
        const recoveredAddress = ethers.verifyMessage(challenge, signature);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({ message: 'Signature verification failed.' });
        }

        // 3. Signature is valid, clear the challenge and issue a JWT
        await query('UPDATE users SET auth_challenge = NULL WHERE id = $1', [user.id]);

        const rolesResult = await query(
            `SELECT r.name as role FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1`,
            [user.id]
        );
        const roles = rolesResult.rows.map((r) => r.role);

        const token = jwt.sign(
            { userId: user.id, walletAddress: user.wallet_address, roles: roles },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user exists
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get user roles and permissions
    const rolesResult = await query(
      `SELECT r.name as role
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );
    const roles = rolesResult.rows.map((r) => r.role);

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roles: roles,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
