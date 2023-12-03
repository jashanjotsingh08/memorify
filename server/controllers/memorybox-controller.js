// memoryBoxController.js

import MemoryBox from '../models/MemoryBox.js';
import { addIAMPolicyForCollaborator, createS3Folder, deleteS3Folder } from '../utils/aws-utils.js';

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
        // Create a subfolder for the new memory box within the user's S3 folder
        const subfolderKey = `${userId}/${newMemoryBox._id}/`;
        // Use the AWS SDK to create the subfolder in S3
        // Make sure to handle errors and check if the folder already exists

        // Update IAM policy for owner to grant access to the new subfolder
        const ownerFolderKey = `${userId}/`;

        await createS3Folder(subfolderKey);
        await addIAMPolicyForCollaborator(userId, userId, ownerFolderKey);

        // Create a new memory box with the owner set to the user

        // Add collaborators to the memory box and update their IAM policies
        if (collaborators && collaborators.length > 0) {
            for (const collaboratorId of collaborators) {
                newMemoryBox.collaborators.push({ user: collaboratorId, accessLink: 'generated-access-link' });
                await addIAMPolicyForCollaborator(userId, collaboratorId, subfolderKey);
            }
        }

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

        // Get the existing collaborators for comparison
        const existingCollaborators = memoryBox.collaborators.map(collaborator => collaborator.user.toString());

        // Update the memory box properties
        memoryBox.title = title;
        memoryBox.collaborators = collaborators;
        memoryBox.tags = tags;


        // Update IAM policies for collaborators with the new information
        const subfolderKey = `${userId}/${memoryBox._id}/`;
        if (collaborators && collaborators.length > 0) {
            for (const collaboratorId of collaborators) {
                if (!existingCollaborators.includes(collaboratorId.toString())) {
                    // Collaborator is new, update IAM policy
                    await addIAMPolicyForCollaborator(userId, collaboratorId, subfolderKey);
                }
            }

            for (const existingCollaboratorId of existingCollaborators) {
                if (!collaborators.includes(existingCollaboratorId.toString())) {
                    // Collaborator has been removed, remove IAM access
                    await removeIAMAccessForCollaborator(userId, existingCollaboratorId, subfolderKey);
                }
            }
        }
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
        const userId = req.user._id;
        const memoryBoxId = req.params.id;
        // Find the memory box by ID where the user is the owner
        const memoryBox = await MemoryBox.findOne({ _id: memoryBoxId, owner: userId });

        if (!memoryBox) {
            return res.status(404).json({ message: 'Memory box not found' });
        }

        // Delete the memory box
        await memoryBox.deleteOne();

        // Cleanup IAM policies for collaborators
        const subfolderKey = `${userId}/${memoryBoxId}/`;
        if (memoryBox.collaborators && memoryBox.collaborators.length > 0) {
            for (const collaborator of memoryBox.collaborators) {
                await removeIAMAccessForCollaborator(userId, collaborator.user.toString(), subfolderKey);
            }
        }

        // Delete the corresponding folder from S3
        await deleteS3Folder(subfolderKey);

        res.status(204).json(); // No content in the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { getAllUserMemoryBoxes, getAllCollaboratorMemoryBoxes, getMemoryBoxById, createMemoryBox, updateMemoryBox, deleteMemoryBox };
