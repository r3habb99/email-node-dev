const Joi = require('joi');

// Joi schema for email validation
const emailSchema = Joi.object({
  recipients: Joi.string().required().label('Recipients'),
  subject: Joi.string().required().label('Subject'),
  message: Joi.string().required().label('Message'),
  buttonLink: Joi.string().uri().allow('').optional().label('Button Link'),
  buttonText: Joi.string().allow('').optional().label('Button Text'),
});

// Function to validate email data
const validateEmail = (data) => {
  return emailSchema.validate(data, { abortEarly: false });
};

module.exports = validateEmail;
