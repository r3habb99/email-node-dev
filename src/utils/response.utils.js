const logger = require('./logger.utils');

// Function to log success and render a success message
const logAndRenderSuccess = (res, successMessage) => {
  logger.info('Emails sent successfully');
  res.cookie('successMessage', successMessage, { path: '/dashboard' });
  // Redirect the user to the homepage
  return res.redirect('/dashboard');
};

// Function to log error and render an error message
const logAndRenderError = (res, errorMessage) => {
  logger.error('Failed to send emails: ' + errorMessage);
  return res.render('index', { successMessage: null, errorMessage });
};

// Function to log and send success response
const successResponse = (res, message) => {
  logger.info(message); // Log success message
  return res.status(200).json({ message });
};

// Function to log and send error response
const failureResponse = (res, errorMessage) => {
  logger.error(errorMessage); // Log error message
  return res.status(500).json({ error: errorMessage });
};

module.exports = {
  logAndRenderSuccess,
  logAndRenderError,
  successResponse,
  failureResponse,
};
