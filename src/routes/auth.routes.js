const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render Signup Form
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Signup' });
});

// Render Login Form
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Handle Signup
router.post('/signup', authController.signup);

// Handle Login
router.post('/login', authController.login);

// Handle Logout
router.post('/logout', authController.logout);

module.exports = router;
