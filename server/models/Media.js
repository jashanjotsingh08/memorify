import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);
export default Media;