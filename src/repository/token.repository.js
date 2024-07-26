// repository/TokenRepository.js
const Token = require('../models/Token');
const logger = require('../utils/logger.utils');

/**
 * Save a new token.
 * @param {Object} tokenData - The token data.
 * @returns {Promise<Token>} - The created token document.
 */
const saveToken = async (tokenData) => {
  try {
    const token = new Token(tokenData);
    return await token.save();
  } catch (error) {
    throw new logger.error('Error while saving token', error);
  }
};

/**
 * Find and delete a token.
 * @param {string} token - The token string.
 * @returns {Promise<Token>} - The deleted token document.
 */
const deleteToken = async (token) => {
  try {
    return await Token.findOneAndDelete(token);
  } catch (error) {
    throw new logger.error('Error while deleting tokens', error);
  }
};

module.exports = {
  saveToken,
  deleteToken,
};
