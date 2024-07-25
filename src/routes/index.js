// routes/index.js
const express = require('express');
const emailRoutes = require('./email.routes');
const linkRoutes = require('./link.routes');
const authRoutes = require('./auth.routes');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/email', authMiddleware, emailRoutes);
router.use('/link', authMiddleware, linkRoutes);
router.use('/auth', authRoutes);

router.get('/', (req, res) => {
  res.render('login', { title: 'Login' });
});
router.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;
