import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust the path based on your project structure

const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

const jwtMiddleware = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization.split(' ')[1];
        // Verify the token
        const decodedToken = jwt.verify(token, MY_SECRET_KEY);

        // Fetch the user from the database using the decoded user ID
        const user = await User.findById(decodedToken.userId);


        // If the user is not found, send an unauthorized response
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Attach the user ID to the request for further use
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export default jwtMiddleware;