import express from 'express';
import authRoutes from './api/auth.js';
import userRoutes from './api/user.js';
import memoryBoxRoutes from './api/memory-box.js';
import memoryRoutes from './api/memory.js';

const router = express.Router();

// Welcome route
router.get('/', (req, res) => {
  res.send('Welcome to Memorify API');
});

// Auth routes
router.use('/auth', authRoutes);

router.use('/users', userRoutes);

router.use('/memory-boxes', memoryBoxRoutes);

router.use('/memory-boxes', memoryRoutes);

export default router;
