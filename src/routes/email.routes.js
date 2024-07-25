const express = require('express');
const uploadMiddleware = require('../config/multer.config');
const emailController = require('../controllers/emailController');
const validateInput = require('../middlewares/validation.middleware');
const emailSchema = require('../validations/email.validation');

const router = express.Router();

router.get('/', (req, res) => {
  const successMessage = req.cookies.successMessage || null;
  res.clearCookie('successMessage');
  res.render('index', { successMessage, errorMessage: null });
});

router.post(
  '/send-email',
  uploadMiddleware,
  validateInput(emailSchema),
  emailController.sendEmail
);
// Route to get email history
router.get('/email-history', emailController.getEmailHistory);

module.exports = router;
