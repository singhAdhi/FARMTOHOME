import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { validationResult } from 'express-validator';

// @desc    Get customer's cart
// @route   GET /api/customer/cart
// @access  Private (Customer only)
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customer: req.user.id })
      .populate('items.product', 'name price images farmer stock');

    if (!cart) {
      cart = new Cart({ customer: req.user.id, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching cart'
      }
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/customer/cart
// @access  Private (Customer only)
const addToCart = async (req, res) => {
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

    const { productId, quantity } = req.body;

    // Check if product exists and is available
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable || !product.isApproved) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_AVAILABLE',
          message: 'Product is not available'
        }
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_STOCK',
          message: `Only ${product.stock} items available`
        }
      });
    }

    let cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      cart = new Cart({ customer: req.user.id, items: [] });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images farmer stock');

    res.json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error adding item to cart'
      }
    });
  }
};

// @desc    Update cart item
// @route   PUT /api/customer/cart/:itemId
// @access  Private (Customer only)
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_QUANTITY',
          message: 'Quantity must be greater than 0'
        }
      });
    }

    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CART_NOT_FOUND',
          message: 'Cart not found'
        }
      });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Item not found in cart'
        }
      });
    }

    // Check stock
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_STOCK',
          message: `Only ${product.stock} items available`
        }
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name price images farmer stock');

    res.json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error updating cart item'
      }
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/customer/cart/:itemId
// @access  Private (Customer only)
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CART_NOT_FOUND',
          message: 'Cart not found'
        }
      });
    }

    cart.items.id(req.params.itemId).remove();
    await cart.save();
    await cart.populate('items.product', 'name price images farmer stock');

    res.json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error removing item from cart'
      }
    });
  }
};

// @desc    Get customer's orders
// @route   GET /api/customer/orders
// @access  Private (Customer only)
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find({ customer: req.user.id })
      .populate('items.product', 'name images')
      .populate('items.farmer', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments({ customer: req.user.id });

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

// @desc    Place new order
// @route   POST /api/customer/orders
// @access  Private (Customer only)
const placeOrder = async (req, res) => {
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

    const { deliveryAddress } = req.body;

    // Get customer's cart
    const cart = await Cart.findOne({ customer: req.user.id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_CART',
          message: 'Cart is empty'
        }
      });
    }

    // Prepare order items
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      // Check availability and stock
      if (!product.isAvailable || !product.isApproved) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PRODUCT_UNAVAILABLE',
            message: `Product ${product.name} is no longer available`
          }
        });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_STOCK',
            message: `Insufficient stock for ${product.name}`
          }
        });
      }

      const itemTotal = product.price * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        farmer: product.farmer,
        productName: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        unit: product.unit,
        subtotal: itemTotal
      });
    }

    // Calculate totals (simplified)
    const deliveryCharges = 50;
    const taxes = subtotal * 0.05; // 5% tax
    const total = subtotal + deliveryCharges + taxes;

    // Create order
    const order = new Order({
      customer: req.user.id,
      items: orderItems,
      subtotal,
      deliveryCharges,
      taxes,
      total,
      deliveryAddress,
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed'
      }]
    });

    await order.save();

    // Update product stock
    for (const cartItem of cart.items) {
      await Product.findByIdAndUpdate(
        cartItem.product._id,
        { $inc: { stock: -cartItem.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error placing order'
      }
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/customer/orders/:id/cancel
// @access  Private (Customer only)
const cancelOrder = async (req, res) => {
  try {
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

    // Check if customer owns this order
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You can only cancel your own orders'
        }
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'accepted'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CANNOT_CANCEL',
          message: 'Order cannot be cancelled at this stage'
        }
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Cancelled by customer',
      updatedBy: req.user.id
    });

    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error cancelling order'
      }
    });
  }
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getMyOrders,
  placeOrder,
  cancelOrder
}; 