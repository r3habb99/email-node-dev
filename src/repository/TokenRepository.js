// repository/TokenRepository.js
const Token = require('../models/Token');

/**
 * Save a new token.
 * @param {Object} tokenData - The token data.
 * @returns {Promise<Token>} - The created token document.
 */
const saveToken = async (tokenData) => {
  const token = new Token(tokenData);
  return await token.save();
};

/**
 * Find and delete a token.
 * @param {string} token - The token string.
 * @returns {Promise<Token>} - The deleted token document.
 */
const deleteToken = async (token) => {
  return await Token.findOneAndDelete({ token });
};

module.exports = {
  saveToken,
  deleteToken,
};
