// repository/UserRepository.js
const { logger } = require('handlebars');
const User = require('../models/User');

/**
 * Find a user by email.
 * @param {string} input - The input of the user.
 * @returns {Promise<User>} - The user document.
 */
const findUser = async (input) => {
  try {
    return await User.findOne(input);
  } catch (error) {
    throw new logger.error('Error while finding user', error);
  }
};

/**
 * Find a user by id.
 * @param {string} input - The input of the user.
 * @returns {Promise<User>} - The user document.
 */
const findUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw new logger.error('Error while finding user by id', error);
  }
};

/**
 * Create a new user.
 * @param {Object} userData - The user data.
 * @returns {Promise<User>} - The created user document.
 */
const createUser = async (inputData) => {
    try {
        const user = new User(inputData);
        return await user.save();
    } catch (error) {
      throw new logger.error('Error while creating user data', error);
    }
};

module.exports = {
  findUser,
  findUserById,
  createUser,
};
