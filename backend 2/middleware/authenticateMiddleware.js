const { verifyToken } = require('./jwt'); // Import verifyToken from jwt.js

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(`Authentication Header: ${authHeader}`);

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(`Token extracted: ${token}`);

        try {
            const user = verifyToken(token);  // Verify the token using the utility
            req.user = user; // Store the user object in the request
            next();
        } catch (err) {
            console.error("JWT Verification Error:", err);
            return res.status(403).json({ error: "Invalid or expired token." });
        }
    } else {
        console.log("Authentication Header: undefined");
        res.status(401).json({ error: "Authorization header missing or malformed." });
    }
};

// Middleware to check if the user is authorized (role-based access control)
const isAuthorized = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ error: "User not authenticated." });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: `Insufficient permissions. Required: ${requiredRole}` });
        }

        next(); // User is authorized, continue to the next middleware/route handler
    };
};

module.exports = { isAuthenticated, isAuthorized };
