import mongoose from 'mongoose';

// Memory Model
const memorySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
        },
    ],
    location: {
        type: String
    },
    tags: [String],
    date: {
        type: Date,
        default: Date.now,
    },
});

const Memory = mongoose.model('Memory', memorySchema);

export default Memory;
