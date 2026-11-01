const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Modify the generateToken function to include additional user info
const generateToken = (userData) => {
    const payload = {
        userId: userData.userId,
        username: userData.username,  // Add username to the token
        joinDate: userData.joinDate,  // Add joinDate to the token
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Token is invalid');
        } else {
            throw new Error('Invalid or expired token');
        }
    }
};

module.exports = {
    generateToken,
    verifyToken,
};
