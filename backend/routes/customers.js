import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getMyOrders,
  placeOrder,
  cancelOrder
} from '../controllers/customerController.js';

import auth from '../middleware/auth.js';
import { validateZod } from '../middleware/validateZod.js';

import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema
} from '../validations/cartValidation.js';

import orderValidation from '../validations/orderValidation.js';
const { placeOrderSchema, cancelOrderSchema } = orderValidation;

const router = express.Router();

// All customer routes require authentication
router.use(auth);

// @route   GET /api/customers/cart
// @desc    Get my cart
// @access  Private (Customer only)
router.get('/cart', getCart);

// @route   POST /api/customers/cart
// @desc    Add item to cart
// @access  Private (Customer only)
router.post('/cart', validateZod(addToCartSchema), addToCart);

// @route   PUT /api/customers/cart/:itemId
// @desc    Update cart item quantity
// @access  Private (Customer only)
router.put('/cart/:itemId', validateZod(updateCartItemSchema), updateCartItem);

// @route   DELETE /api/customers/cart/:itemId
// @desc    Remove item from cart
// @access  Private (Customer only)
router.delete('/cart/:itemId', validateZod(removeCartItemSchema), removeFromCart);

// @route   GET /api/customers/orders
// @desc    Get my orders
// @access  Private (Customer only)
router.get('/orders', getMyOrders);

// @route   POST /api/customers/orders
// @desc    Place new order
// @access  Private (Customer only)
router.post('/orders', validateZod(placeOrderSchema), placeOrder);

// @route   PUT /api/customers/orders/:id/cancel
// @desc    Cancel order
// @access  Private (Customer only)
router.put('/orders/:id/cancel', validateZod(cancelOrderSchema), cancelOrder);

export default router;