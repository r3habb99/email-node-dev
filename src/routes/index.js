// routes/index.js
const express = require('express');
const emailRoutes = require('./email.routes');
const linkRoutes = require('./link.routes');
const productsRoutes = require('./products.routes');

const router = express.Router();

router.use('/email', emailRoutes);
router.use('/link', linkRoutes);
router.use('/product-data', productsRoutes);

router.get('/', (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;
