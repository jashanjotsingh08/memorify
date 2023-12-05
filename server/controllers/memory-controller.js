import Memory from '../models/Memory.js';
import MemoryBox from '../models/MemoryBox.js';
import { uploadToS3Bucket, deleteFromS3, getSignedUrl } from '../utils/aws-utils.js';

const createMemory = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const { memoryBoxId } = req.params;
    const fileBuffer = req.file.buffer;

    // Check if the memory box belongs to the authenticated user
    const memoryBox = await MemoryBox.findOne({ _id: memoryBoxId });
    if (!memoryBox) {
      return res.status(403).json({ error: 'Forbidden - Memory box does not belong to the user.' });
    }

    const fileName = `${Date.now()}_${req.file.originalname}`;

    const s3Key = `${req.user._id}/${memoryBoxId}/${fileName}`;
    const s3UploadResponse = await uploadToS3Bucket(s3Key, fileBuffer);
    const newMemory = await Memory.create({
      title,
      description,
      memoryBox,
      tags,
      fileName,
      contentUrl: s3UploadResponse.Location
    });

    memoryBox.memories.push(newMemory);
    await memoryBox.save();

    res.status(201).json(newMemory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getMemory = async (req, res) => {
  try {
    const { memoryBoxId, memoryId } = req.params;
    const memory = await Memory.find({ _id: memoryId, memoryBoxId: memoryBoxId });
    // const s3Key = `${req.user._id}/${memoryBoxId}/${memory.fileName}`;
    // const signedUrl = await getSignedUrl(s3Key);
    res.status(200).json({ memory });
  } catch (error) {
    console.error('Error fetching memories:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getMemories = async (req, res) => {
  try {
    const { memoryBoxId } = req.params;
    const userId = req.user._id;
    // Retrieve memories and populate the associated MemoryBox details
    const memories = await Memory.find({
      memoryBox: memoryBoxId,
    }).populate('memoryBox');


    // const signedMemories = await Promise.all(memories.map(async (memory) => {
    //   const s3Key = `${req.user._id}/${memoryBoxId}/${memory.fileName}`;
    //   const signedUrl = await getSignedUrl(s3Key);
    //   return { ...memory, url: signedUrl };
    // }));

    res.status(200).json({ memories });
  } catch (error) {
    console.error('Error fetching memories:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteMemory = async (req, res) => {
  try {
    const { memoryBoxId, memoryId } = req.params;

    // Check if the memory belongs to the authenticated user
    const memory = await Memory.findOne({ _id: memoryId });
    if (!memory) {
      return res.status(403).json({ error: 'Forbidden - Memory does not belong to the user.' });
    }

    // Delete the memory and its associated S3 content
    const s3Key = `${req.user._id}/${memoryBoxId}/${memory.fileName}`;
    await deleteFromS3(s3Key);

    await Memory.deleteOne({ _id: memoryId });

    res.status(200).json({ message: 'Memory deleted successfully.' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateMemory = async (req, res) => {
  try {
    const { memoryBoxId, memoryId } = req.params;
    const { tags, title, description } = req.body;

    // Check if the memory belongs to the authenticated user
    const memory = await Memory.findOne({ _id: memoryId });
    if (!memory) {
      return res.status(403).json({ error: 'Forbidden - Memory does not belong to the user.' });
    }

    memory.tags = tags;
    memory.title = title;
    memory.description = description;

    await memory.save();

    res.status(200).json({ message: 'Memory updated successfully.', memory });
  } catch (error) {
    console.error('Error updating memory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { createMemory, deleteMemory, getMemory, updateMemory, getMemories };
