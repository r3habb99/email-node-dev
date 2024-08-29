const Product = require('../models/Products');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
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
    console.log(req.body);
    if (
      !name ||
      !description ||
      !price ||
      !imageUrl ||
      !material ||
      !careInstructions
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new product instance
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

    // Save the product to the database
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
};

// Read all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
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
