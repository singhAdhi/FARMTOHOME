import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { validationResult } from 'express-validator';

// @desc    Get farmer's products
// @route   GET /api/farmer/products
// @access  Private (Farmer only)
const getMyProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find({ farmer: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments({ farmer: req.user.id });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalProducts: total
        }
      }
    });

  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching your products'
      }
    });
  }
};

// @desc    Create new product
// @route   POST /api/farmer/products
// @access  Private (Farmer only)
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const {
      name,
      description,
      price,
      category,
      unit,
      stock,
      images,
      isOrganic,
      tags
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      unit,
      stock,
      farmer: req.user.id,
      images: images || [],
      isOrganic: isOrganic || false,
      tags: tags || [],
      isAvailable: true,
      isApproved: false // Admin needs to approve
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error creating product'
      }
    });
  }
};

// @desc    Update product
// @route   PUT /api/farmer/products/:id
// @access  Private (Farmer only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    // Check if farmer owns this product
    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You can only update your own products'
        }
      });
    }

    const {
      name,
      description,
      price,
      category,
      unit,
      stock,
      images,
      isOrganic,
      tags,
      isAvailable
    } = req.body;

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (unit) product.unit = unit;
    if (stock !== undefined) product.stock = stock;
    if (images) product.images = images;
    if (isOrganic !== undefined) product.isOrganic = isOrganic;
    if (tags) product.tags = tags;
    if (isAvailable !== undefined) product.isAvailable = isAvailable;
    product.updatedAt = new Date();

    await product.save();

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error updating product'
      }
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/farmer/products/:id
// @access  Private (Farmer only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    // Check if farmer owns this product
    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You can only delete your own products'
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error deleting product'
      }
    });
  }
};

// @desc    Get orders for farmer's products
// @route   GET /api/farmer/orders
// @access  Private (Farmer only)
const getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    let filter = { 'items.farmer': req.user.id };
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalOrders: total
        }
      }
    });

  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching your orders'
      }
    });
  }
};

// @desc    Update order status
// @route   PUT /api/farmer/orders/:id
// @access  Private (Farmer only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['accepted', 'processing', 'shipped', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: 'Invalid order status'
        }
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Order not found'
        }
      });
    }

    // Check if this order contains farmer's products
    const hasMyProducts = order.items.some(item => 
      item.farmer.toString() === req.user.id
    );

    if (!hasMyProducts) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You can only update orders for your products'
        }
      });
    }

    // Update status
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: `Updated by farmer`,
      updatedBy: req.user.id
    });

    await order.save();

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error updating order status'
      }
    });
  }
};

// @desc    Get farmer analytics
// @route   GET /api/farmer/analytics
// @access  Private (Farmer only)
const getAnalytics = async (req, res) => {
  try {
    // Get total products
    const totalProducts = await Product.countDocuments({ farmer: req.user.id });

    // Get approved products
    const approvedProducts = await Product.countDocuments({ 
      farmer: req.user.id, 
      isApproved: true 
    });

    // Get total orders
    const totalOrders = await Order.countDocuments({ 'items.farmer': req.user.id });

    // Get pending orders
    const pendingOrders = await Order.countDocuments({ 
      'items.farmer': req.user.id, 
      status: 'pending' 
    });

    // Calculate total earnings (simplified)
    const orders = await Order.find({ 'items.farmer': req.user.id, status: 'delivered' });
    let totalEarnings = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.farmer.toString() === req.user.id) {
          totalEarnings += item.subtotal;
        }
      });
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        approvedProducts,
        totalOrders,
        pendingOrders,
        totalEarnings
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching analytics'
      }
    });
  }
};

export {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyOrders,
  updateOrderStatus,
  getAnalytics
}; 