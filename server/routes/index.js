import express from 'express';
import authRoutes from './api/auth.js';

const router = express.Router();

// Welcome route
router.get('/', (req, res) => {
  res.send('Welcome to Memorify API');
});

// Auth routes
router.use('/auth', authRoutes);

export default router;
