// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { findUserById } = require('../repository/user.repository');
const logger = require('../utils/logger.utils');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    logger.warn('No token found, redirecting to login.');
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);
    if (!user) {
      logger.warn('User not found for token, redirecting to login.');
      return res.redirect('/auth/login');
    }
    req.user = user; // Attach user object to request
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    logger.error('Error verifying token:', error.message);
    return res.redirect('/auth/login');
  }
};

module.exports = authMiddleware;
