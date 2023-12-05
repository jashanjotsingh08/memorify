import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        default: null,
    },
    memories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Memory',
    }],
    subCollections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
    }],
    tags: [String]
}, { timestamps: true });

collectionSchema.index({ tags: 1 });

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
