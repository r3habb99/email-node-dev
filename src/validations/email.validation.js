// validations/email.validation.js
const Joi = require('joi');

// Custom Joi method to validate email list
const customJoi = Joi.extend((joi) => ({
  type: 'emailList',
  base: joi.string(),
  messages: {
    'emailList.invalid':
      '{{#label}} must be a valid comma-separated list of email addresses',
  },
  validate(value, helpers) {
    const emails = value.split(',').map((email) => email.trim());
    const emailSchema = Joi.string().email({ tlds: { allow: false } });
    for (const email of emails) {
      const { error } = emailSchema.validate(email);
      if (error) {
        return { value, errors: helpers.error('emailList.invalid') };
      }
    }
  },
}));

// Joi schema for email validation
const emailSchema = Joi.object({
  recipients: customJoi.emailList().required().label('Recipients').messages({
    'string.empty': 'Recipients field cannot be empty',
    'any.required': 'Recipients field is required',
  }),
  subject: Joi.string().required().label('Subject').messages({
    'string.empty': 'Subject field cannot be empty',
    'any.required': 'Subject field is required',
  }),
  message: Joi.string().required().label('Message').messages({
    'string.empty': 'Message field cannot be empty',
    'any.required': 'Message field is required',
  }),
  buttonLink: Joi.string()
    .uri()
    .allow('')
    .optional()
    .label('Button Link')
    .messages({
      'string.uri': 'Button Link must be a valid URI',
    }),
  buttonText: Joi.string().allow('').optional().label('Button Text'),
  attachments: Joi.array()
    .items(
      Joi.object({
        originalname: Joi.string().required(),
        path: Joi.string().required(),
      })
    )
    .optional()
    .label('Attachments')
    .messages({
      'array.base': 'Attachments must be an array of file objects',
    }),
});

module.exports = emailSchema;
