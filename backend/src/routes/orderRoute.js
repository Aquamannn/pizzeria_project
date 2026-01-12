// backend/src/routes/orderRoute.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// URL: /api/orders
router.post('/', orderController.createOrder); // Untuk Checkout
router.get('/', orderController.getAllOrders); // Untuk Admin lihat Riwayat

module.exports = router;