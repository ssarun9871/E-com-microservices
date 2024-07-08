const express = require('express');
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/jwt');
const router = express.Router();

router.post('/',verifyToken, productController.createProduct);
router.get('/', verifyToken, productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
