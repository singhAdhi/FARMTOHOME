import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile
} from '../controllers/authController.js';

import auth from '../middleware/auth.js';

import {validateZod} from '../middleware/validateZod.js';
// Import validation schemas
import {
  registerSchema,
  loginSchema,
  updateProfileSchema
} from '../validations/authValidation.js';  

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', validateZod(registerSchema), register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateZod(loginSchema), login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, validateZod(updateProfileSchema), updateProfile);

export default router; 