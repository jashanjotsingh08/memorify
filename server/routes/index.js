import express from 'express';
import authRoutes from './api/auth.js';
import userRoutes from './api/user.js';

const router = express.Router();

// Welcome route
router.get('/', (req, res) => {
  res.send('Welcome to Memorify API');
});

// Auth routes
router.use('/auth', authRoutes);

router.use('/users', userRoutes);

export default router;
