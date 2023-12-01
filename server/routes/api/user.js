import express from 'express';
import { getUserById } from '../../controllers/user-controller.js';
import jwtMiddleware from '../../utils/jwtMiddleware.js';

const router = express.Router();

router.get('/:id', jwtMiddleware, getUserById);

export default router;
