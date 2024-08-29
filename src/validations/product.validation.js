const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  imageUrl: Joi.string().uri().required(),
  sizes: Joi.array(),
  colors: Joi.array(),
  material: Joi.string().required(),
  careInstructions: Joi.string().required(),
});
module.exports = productSchema;
