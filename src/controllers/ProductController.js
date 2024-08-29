const Product = require('../models/Products');
const logger = require('../utils/logger.utils');
// Create a new product
const validateInput = (req) => {
  const { name, description, price, imageUrl, material, careInstructions } =
    req.body;

  if (
    !name ||
    !description ||
    !price ||
    !imageUrl ||
    !material ||
    !careInstructions
  ) {
    logger.error('Missing required fields');
    throw new Error('Missing required fields');
  }

  if (!isValidPrice(price)) {
    logger.error('Invalid price value');
    throw new Error('Invalid price value');
  }

  if (!isValidUrl(imageUrl)) {
    logger.error('Invalid imageUrl value');
    throw new Error('Invalid imageUrl value');
  }
};

const isValidPrice = (price) => !isNaN(price) && price > 0;

const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (_) {
    return false;
  }
};

exports.createProduct = async (req, res) => {
  try {
    validateInput(req);

    const {
      name,
      description,
      price,
      imageUrl,
      sizes,
      colors,
      material,
      careInstructions,
    } = req.body;
    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      sizes,
      colors,
      material,
      careInstructions,
    });

    await product.save();

    logger.info(`Product created successfully with id: ${product.id}`);
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    logger.error('Error creating product', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    // Get page and limit from query parameters with defaults
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Calculate the starting index
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Fetch the products with pagination
    const products = await Product.find()
      .lean() // Lean for faster response
      .skip(startIndex)
      .limit(limit)
      .exec(); // Execute the query

    // Get the total count of products
    const totalCount = await Product.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    // Create a response object
    const results = {
      totalCount, // Total number of products
      totalPages, // Total number of pages
      currentPage: page, // Current page number
      results: products, // Array of products for the current page
    };

    // Add previous page data if applicable
    if (startIndex > 0) {
      results.previous = { page: page - 1, limit };
    }

    // Add next page data if applicable
    if (endIndex < totalCount) {
      results.next = { page: page + 1, limit };
    }

    // Send the response
    res.status(200).json(results);
  } catch (error) {
    // Log and return error response
    logger.error('Error retrieving products:', error);
    res
      .status(500)
      .json({ message: 'Error retrieving products', error: error.message });
  }
};



// Read a product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
