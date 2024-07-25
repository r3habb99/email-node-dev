// repository/UserRepository.js
const User = require('../models/User');

/**
 * Find a user by email.
 * @param {string} input - The input of the user.
 * @returns {Promise<User>} - The user document.
 */
const findUser = async (input) => {
  return await User.findOne(input);
};

/**
 * Find a user by id.
 * @param {string} input - The input of the user.
 * @returns {Promise<User>} - The user document.
 */
const findUserById = async (id) => {
  return await User.findById(id);
};

/**
 * Create a new user.
 * @param {Object} userData - The user data.
 * @returns {Promise<User>} - The created user document.
 */
const createUser = async (inputData) => {
  const user = new User(inputData);
  return await user.save();
};

module.exports = {
  findUser,
  findUserById,
  createUser,
};
