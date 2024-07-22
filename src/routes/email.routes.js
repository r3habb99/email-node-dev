const express = require('express');
const uploadMiddleware = require('../config/multer.config');
const emailController = require('../controllers/emailController');
const validateEmailData = require('../middlewares/validation.middleware');

const router = express.Router();

router.get('/', (req, res) => {
  const successMessage = req.cookies.successMessage || null;
  res.clearCookie('successMessage');
  res.render('index', { successMessage, errorMessage: null });
});

router.post(
  '/send-email',
  uploadMiddleware,
  validateEmailData,
  emailController.sendEmail
);

module.exports = router;
