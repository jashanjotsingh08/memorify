import express from 'express';
import jwtMiddleware from '../../utils/jwtMiddleware.js';
import multer from 'multer';
import { createMemory, deleteMemory, getMemory, updateMemory, getMemories } from '../../controllers/memory-controller.js';

const router = express.Router();
const upload = multer();

router.use(jwtMiddleware);

router.post('/:memoryBoxId/memories', upload.single('file'), createMemory);

router.get('/:memoryBoxId/memories/', getMemories);

router.get('/:memoryBoxId/memories/:memoryId', getMemory);


router.put('/:memoryBoxId/memories/:memoryId', updateMemory);

router.delete('/:memoryBoxId/memories/:memoryId', deleteMemory);

export default router;

