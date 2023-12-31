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
  memories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Memory' }], // References to individual memories
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  reminders: [{ date: { type: Date, required: true } }],
  timeCapsuleDate: { type: Date },
  tags: [String],
}, { timestamps: true });

const MemoryBox = mongoose.model('MemoryBox', memoryBoxSchema);

export default MemoryBox;
