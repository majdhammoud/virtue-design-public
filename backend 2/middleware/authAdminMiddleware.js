// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

module.exports = async function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.findByUserId(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    if (!user.IsAdmin) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    req.user = user; // Attach user info to the request object
    next(); // Allow access
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};
  