import express from 'express';
import {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyOrders,
  updateOrderStatus,
  getAnalytics
} from '../controllers/farmerController.js';

import auth from '../middleware/auth.js';
import { validateZod } from '../middleware/validateZod.js';

import {
  createProductSchema,
  updateProductSchema
} from '../validations/productValidation.js';

const router = express.Router();

// All farmer routes require authentication
router.use(auth);

// @route   GET /api/farmers/products
// @desc    Get my products
// @access  Private (Farmer only)
router.get('/products', getMyProducts);

// @route   POST /api/farmers/products
// @desc    Create new product
// @access  Private (Farmer only)
router.post('/products', validateZod(createProductSchema), createProduct);

// @route   PUT /api/farmers/products/:id
// @desc    Update my product
// @access  Private (Farmer only)
router.put('/products/:id', validateZod(updateProductSchema), updateProduct);

// @route   DELETE /api/farmers/products/:id
// @desc    Delete my product
// @access  Private (Farmer only)
router.delete('/products/:id', deleteProduct);

// @route   GET /api/farmers/orders
// @desc    Get my orders
// @access  Private (Farmer only)
router.get('/orders', getMyOrders);

// @route   PUT /api/farmers/orders/:id/status
// @desc    Update order status
// @access  Private (Farmer only)
router.put('/orders/:id/status', updateOrderStatus);

// @route   GET /api/farmers/analytics
// @desc    Get my analytics
// @access  Private (Farmer only)
router.get('/analytics', getAnalytics);

export default router;