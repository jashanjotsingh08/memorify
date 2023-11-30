import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    title: {
        type: String,
        required: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        default: null, // For top-level collections
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
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
