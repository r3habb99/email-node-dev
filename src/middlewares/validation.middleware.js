const validateEmail = require('../validations/email.validation');
const { logAndRenderError } = require('../utils/response.utils');

/**
 * Middleware to validate request data using Joi schema.
 * @param {Joi.ObjectSchema} schema - Joi schema for validation.
 * @returns {Function} - Express middleware function.
 */
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((d) => d.message).join('. ');
      return logAndRenderError(res, 400, 'error', errorMessage);
    }
    req.validatedBody = value; // Pass the validated body to the next middleware
    next();
  };
};
module.exports = validateInput;
