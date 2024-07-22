const logger = require('./logger.utils');

// Function to log success and render success message
const logAndRenderSuccess = (res, successMessage) => {
  logger.info('Emails sent successfully');
  res.cookie('successMessage', successMessage, { path: '/' });
  return res.redirect('/');
};

// Function to log error and render error message
const logAndRenderError = (res, errorMessage) => {
  logger.error('Failed to send emails: ' + errorMessage);
  return res.render('index', { successMessage: null, errorMessage });
};

module.exports = {
  logAndRenderSuccess,
  logAndRenderError,
};
