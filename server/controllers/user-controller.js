// Import necessary libraries
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createS3UserFolder } from '../utils/aws-utils.js';

const secretKey = process.env.MY_SECRET_KEY;

const getUserById = async (req, res) => {
    try {
        // Extract user ID from the request parameters
        const userId = req.userId;

        // Find the user by ID in the database
        const user = await User.findById(userId).populate("memoryBoxes");

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the user data in the response
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if the new email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.userId) {
        return res.status(400).json({ error: 'Email is already in use.' });
      }
  
      // Update user details
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { email },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.status(200).json({ message: 'User profile updated successfully.', user: updatedUser });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export { getUserById, updateUserProfile };
