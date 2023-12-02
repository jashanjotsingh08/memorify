// Import necessary libraries
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const secretKey = process.env.MY_SECRET_KEY;

// Function to register a new user
const registerUser = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password, firstName, lastName, birthday } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ email, password: hashedPassword, firstName, lastName, birthday });

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '7d' }); // 7 days expiration

        // Send the token in the response
        res.status(201).json({ token, userId: newUser._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Function to log in a user
const loginUser = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '7d' }); // 7 days expiration

        // Send the token in the response
        res.status(200).json({ token, userId: user._id, firstName: user.firstName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUserById = async (req, res) => {
    try {
        // Extract user ID from the request parameters
        const userId = req.params.userId;

        // Find the user by ID in the database
        const user = await User.findById(userId);

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

export { registerUser, loginUser, getUserById };
