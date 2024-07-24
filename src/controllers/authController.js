const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create JWT token
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Signup controller
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password, role: 'Admin' });
    await user.save();
    // Redirect to login page after signup
    res.redirect('/auth/login');
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error signing up user.' });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid credentials.' });

    const token = createToken(user._id, user.role);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ error: 'Error logging in user.' });
  }
};

// Logout controller
exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/auth/login');
};
