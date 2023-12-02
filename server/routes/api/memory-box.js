import express from 'express';
import { getAllUserMemoryBoxes, getAllCollaboratorMemoryBoxes, getMemoryBoxById, createMemoryBox, updateMemoryBox, deleteMemoryBox } from '../../controllers/memorybox-controller.js';
import jwtMiddleware from '../../utils/jwtMiddleware.js';

const router = express.Router();

// Apply JWT middleware to protect routes
router.use(jwtMiddleware);

// Define routes
router.get('/', getAllUserMemoryBoxes);
router.get('/collaborations', getAllCollaboratorMemoryBoxes);
router.get('/:id', getMemoryBoxById);
router.post('/', createMemoryBox);
router.put('/:id', updateMemoryBox);
router.delete('/:id', deleteMemoryBox);

export default router;
