import { Router } from 'express';
import { register, login, getWeb3Challenge, web3Login } from '../controllers/authController';

const router = Router();

// Standard email/password auth
router.post('/register', register);
router.post('/login', login);

// Web3 auth
router.post('/web3/challenge', getWeb3Challenge);
router.post('/web3/login', web3Login);

export default router;
