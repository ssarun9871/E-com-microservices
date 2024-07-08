const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {verifyToken} = require('../middleware/jwt')


router.post('/', verifyToken, orderController.createOrder);
router.get('/:order_id', verifyToken, orderController.getOrderByOrderId)

module.exports = router;
