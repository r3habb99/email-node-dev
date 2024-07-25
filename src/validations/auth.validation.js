const Joi = require('joi');

// Joi schema for signup validation
const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().label('Username').messages({
    'string.empty': 'Username field cannot be empty',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
    'any.required': 'Username field is required',
  }),
  email: Joi.string().email().required().label('Email').messages({
    'string.empty': 'Email field cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email field is required',
  }),
  password: Joi.string().min(6).required().label('Password').messages({
    'string.empty': 'Password field cannot be empty',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password field is required',
  }),
});

// Joi schema for login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().label('Email').messages({
    'string.empty': 'Email field cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email field is required',
  }),
  password: Joi.string().required().label('Password').messages({
    'string.empty': 'Password field cannot be empty',
    'any.required': 'Password field is required',
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
};
