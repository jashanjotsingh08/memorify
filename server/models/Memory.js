import mongoose from 'mongoose';
// Memory Model
const memorySchema = new mongoose.Schema({
    memoryBox: { type: mongoose.Schema.Types.ObjectId, ref: 'MemoryBox', required: true },
    // collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    contentUrl: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    fileName: {
        type: String
    },
    contentType: { 
        type: String
    },
    tags: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

const Memory = mongoose.model('Memory', memorySchema);

export default Memory;
