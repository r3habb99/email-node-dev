// response.utils.js

const logger = require('./logger.utils');

// Function to log success and render a success message
const logAndRenderSuccess = (res, successMessage) => {
  logger.info(successMessage);
  res.cookie('successMessage', successMessage, { path: '/' });
  return res.redirect('/email');
};

// Function to log error and render an error message
const logAndRenderError = (res, errorMessage, statusCode = 500) => {
  logger.error(errorMessage);
  return res
    .status(statusCode)
    .render('index', { successMessage: null, errorMessage });
};
// Function to log and send success response
const successResponse = (res, message, statusCode = 200) => {
  logger.info(message);
  return res.status(statusCode).json({ message });
};

// Function to log and send error response
const failureResponse = (res, errorMessage, statusCode = 500) => {
  logger.error(errorMessage);
  return res.status(statusCode).json({ error: errorMessage });
};

module.exports = {
  logAndRenderSuccess,
  logAndRenderError,
  successResponse,
  failureResponse,
};
