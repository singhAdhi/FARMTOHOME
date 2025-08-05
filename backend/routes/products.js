import express from 'express';
import {
  getProducts,
  getProduct,
  searchProducts,
  getProductsByFarmer,
  getCategories
} from '../controllers/productController.js';

import { validateZod } from '../middleware/validateZod.js';

import {
  getProductsQuerySchema,
  getProductByIdSchema,
  searchProductsSchema
} from '../validations/productValidation.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products (public)
// @access  Public
router.get('/', validateZod(getProductsQuerySchema), getProducts);

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', validateZod(searchProductsSchema), searchProducts);

// @route   GET /api/products/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', getCategories);

// @route   GET /api/products/farmer/:farmerId
// @desc    Get products by farmer
// @access  Public
router.get('/farmer/:farmerId', getProductsByFarmer);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', validateZod(getProductByIdSchema), getProduct);

export default router; 