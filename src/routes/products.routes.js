const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

// Define routes and associate them with controller methods
router.post('/products', productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
