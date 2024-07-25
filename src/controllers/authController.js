// auth.controller.js
const { createUser, findUser } = require('../repository/user.repository');
const { saveToken, deleteToken } = require('../repository/token.repository');
const createToken = require('../utils/generateToken.utils');
const { successResponse, failureResponse } = require('../utils/response.utils');
const logger = require('../utils/logger.utils');

// Signup controller
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await findUser({ email });
    if (existingUser) {
      return failureResponse(res, 'User already exists with this email.');
    }

    // Create new user
    await createUser({ username, email, password, role: 'Admin' });

    // Redirect to login page after signup
    return successResponse(res, 'User signed up successfully.');
  } catch (error) {
    logger.error('Error signing up user:', error);
    return failureResponse(
      res,
      'Error signing up user. Please try again later.'
    );
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUser({ email });
    if (!user) return failureResponse(res, 'Invalid credentials.', 404);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return failureResponse(res, 'Invalid credentials.');

    const token = createToken(user._id, user.role, email);

    // Store token in the database
    await saveToken({ userId: user._id, token });

    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/dashboard');
  } catch (error) {
    logger.error('Error logging in user:', error);
    return failureResponse(res, 'Error logging in user.');
  }
};

// Logout controller
exports.logout = async (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      await deleteToken({ token });
    } catch (error) {
      logger.error('Error deleting token:', error);
    }
  }

  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/auth/login');
};
