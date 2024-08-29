const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Product schema with improved validation and data types
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String, // Keeping as String but should ideally be Number
      required: true,
      validate: {
        validator: function (v) {
          return /^\$?\d+(\.\d{2})?$/.test(v); // Basic validation for currency format
        },
        message: 'Invalid price format',
      },
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/[^\s]+$/.test(v); // Basic URL validation
        },
        message: 'Invalid URL',
      },
    },
    sizes: {
      type: [String],
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], // Define possible sizes
    },
    colors: {
      type: [String],
      required: true,
      enum: [
        'White',
        'Blue',
        'Black',
        'Gray',
        'Charcoal',
        'Beige',
        'Navy',
        'Ivory',
        'Blush',
        'Brown',
        'Olive',
        'Khaki',
        'Red',
        'Green',
        'Floral Print',
        'Maroon',
      ], // Define possible colors
    },
    material: {
      type: String,
      required: true,
      trim: true,
    },
    careInstructions: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically handles `createdAt` and `updatedAt`
  }
);

// Indexes for efficient querying
productSchema.index({ name: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
