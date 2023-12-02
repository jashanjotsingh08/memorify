// memoryBoxController.js

import MemoryBox from '../models/MemoryBox.js';

const getAllUserMemoryBoxes = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have a middleware to extract userId from the JWT token

        // Find all memory boxes where the user is the owner
        const userMemoryBoxes = await MemoryBox.find({ owner: userId });

        res.status(200).json(userMemoryBoxes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAllCollaboratorMemoryBoxes = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have a middleware to extract userId from the JWT token

        // Find all memory boxes where the user is a collaborator
        const collaboratorMemoryBoxes = await MemoryBox.find({ 'collaborators.user': userId });

        res.status(200).json(collaboratorMemoryBoxes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getMemoryBoxById = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have a middleware to extract userId from the JWT token
        const memoryBoxId = req.params.id;

        // Find the memory box by ID where the user is the owner or a collaborator
        const memoryBox = await MemoryBox.findOne({
            _id: memoryBoxId,
            $or: [
                { owner: userId },
                { 'collaborators.user': userId },
            ],
        });

        if (!memoryBox) {
            return res.status(404).json({ message: 'Memory box not found' });
        }

        res.status(200).json(memoryBox);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createMemoryBox = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, collaborators } = req.body;

        // Check if the title is unique for the user
        const existingMemoryBox = await MemoryBox.findOne({ owner: userId, title });
        if (existingMemoryBox) {
            return res.status(400).json({ message: 'Memory box with this title already exists for the user' });
        }

        const newMemoryBox = await MemoryBox.create({
            title,
            owner: userId,
            collaborators,
        });

        res.status(201).json(newMemoryBox);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateMemoryBox = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have a middleware to extract userId from the JWT token
        const memoryBoxId = req.params.id;
        const { title, collaborators, tags } = req.body;

        // Find the memory box by ID where the user is the owner
        const memoryBox = await MemoryBox.findOne({ _id: memoryBoxId, owner: userId });

        if (!memoryBox) {
            return res.status(404).json({ message: 'Memory box not found' });
        }

        // Check if the updated title is unique for the user
        if (title !== memoryBox.title) {
            const existingMemoryBox = await MemoryBox.findOne({ owner: userId, title });
            if (existingMemoryBox) {
                return res.status(400).json({ message: 'Memory box with this title already exists for the user' });
            }
        }

        // Update the memory box properties
        memoryBox.title = title;
        memoryBox.collaborators = collaborators;
        memoryBox.tags = tags;

        // Save the updated memory box
        await memoryBox.save();

        res.status(200).json(memoryBox);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteMemoryBox = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have a middleware to extract userId from the JWT token
        const memoryBoxId = req.params.id;

        // Find the memory box by ID where the user is the owner
        const memoryBox = await MemoryBox.findOne({ _id: memoryBoxId, owner: userId });

        if (!memoryBox) {
            return res.status(404).json({ message: 'Memory box not found' });
        }

        // Delete the memory box
        await memoryBox.delete();

        res.status(204).json(); // No content in the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { getAllUserMemoryBoxes, getAllCollaboratorMemoryBoxes, getMemoryBoxById, createMemoryBox, updateMemoryBox, deleteMemoryBox };
