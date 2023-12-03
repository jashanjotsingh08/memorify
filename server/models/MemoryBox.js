import mongoose from 'mongoose';

const memoryBoxSchema = new mongoose.Schema({
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
}, { timestamps: true });

const MemoryBox = mongoose.model('MemoryBox', memoryBoxSchema);

export default MemoryBox;
