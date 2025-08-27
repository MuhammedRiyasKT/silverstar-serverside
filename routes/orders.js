const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders (Public)
router.post('/', createOrder);

// @route   GET /api/orders/public (Customer order tracking)
router.get('/public', getOrders);

// @route   GET /api/orders (Admin only, with auth)
router.get('/', auth, getOrders);

// @route   GET /api/orders/:id (Admin only)
router.get('/:id', auth, getOrder);

// @route   PUT /api/orders/:id/status (Admin only)
router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;
