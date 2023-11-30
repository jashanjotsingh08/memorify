import mongoose from 'mongoose';
import { Collection } from './Collection'; // Adjust the path as per your file structure
import { Memory } from './Memory'; // Adjust the path as per your file structure

const memoryBoxSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      accessLink: String,
    },
  ],
  contents: [
    {
      type: {
        type: String,
        enum: ['Collection', 'Memory'],
        required: true,
      },
      content: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'contents.type',
      },
    },
  ],
  tags: [String],
});

const MemoryBox = mongoose.model('MemoryBox', memoryBoxSchema);

export default MemoryBox;
