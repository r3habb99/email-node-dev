const jwt = require('jsonwebtoken');
const logger = require('./logger.utils');
/**
 * Creates a JWT token for a user.
 *
 * @param {string} id - The user ID.
 * @param {string} role - The user role.
 * @param {string} email - The user email.
 * @returns {string} - The generated JWT token.
 */
const createToken = (id, role, email) => {
  const payload = {
    id,
    role,
    email,
  };

  try {
    return jwt.sign(payload, process.env.JWT_SECRET);
  } catch (error) {
    logger.error('Error generating token:', error);
    throw new Error('Token generation failed');
  }
};

module.exports = createToken;
