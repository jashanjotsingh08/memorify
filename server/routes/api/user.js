import express from 'express';
import { getUserById, updateUserProfile } from '../../controllers/user-controller.js';
import jwtMiddleware from '../../utils/jwtMiddleware.js';

const router = express.Router();

router.use(jwtMiddleware);

// GET /user/profile
router.get('/profile', getUserById);

// PUT /user/profile
router.put('/profile', updateUserProfile);

export default router;
