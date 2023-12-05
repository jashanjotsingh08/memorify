import express from 'express';
import { registerUser, loginUser } from '../../controllers/authentication-controller.js';
import jwtMiddleware from '../../utils/jwtMiddleware.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

export default router;
