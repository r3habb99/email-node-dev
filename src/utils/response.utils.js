const logger = require('./logger.utils');

// // Function to log success and render a success message
// const logAndRenderSuccess = (res, successMessage) => {
//   // Log a success message using the logger
//   logger.info('Emails sent successfully');
//   // Set a cookie with the success message to be used on the redirected page
//   res.cookie('successMessage', successMessage, { path: '/email' });
//   // Redirect the user to the homepage
//   return res.redirect('/email');
// };

// Function to log success and render a success message
const logAndRenderSuccess = (res, successMessage) => {
  // Log a success message using the logger
  logger.info('Emails sent successfully');
  // Send a JSON response with the success message
  res.status(200).json({ successMessage });
};


// Function to log error and render an error message
const logAndRenderError = (res, errorMessage) => {
  // Log an error message using the logger with the provided error details
  logger.error('Failed to send emails: ' + errorMessage);
  // Render the index page with the error message
  // Clear any existing success message and show the provided error message
  return res.render('index', { successMessage: null, errorMessage });
};

module.exports = {
  logAndRenderSuccess,
  logAndRenderError,
};
