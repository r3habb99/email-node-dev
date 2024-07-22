const validateEmail = require('../validations/email.validation');
const { logAndRenderError } = require('../utils/response.utils');

const validateEmailData = (req, res, next) => {
  const { error, value } = validateEmail(req.body);
  if (error) {
    const errorMessage = error.details.map((d) => d.message).join('. ');
    return logAndRenderError(res, 400, 'error', errorMessage);
  }
  req.validatedBody = value; // Pass the validated body to the next middleware
  next();
};

module.exports = validateEmailData;
