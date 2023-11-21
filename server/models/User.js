import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    memoryBoxes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MemoryBox',
        },
    ],
});

const User = mongoose.model('User', userSchema);

export default User;
