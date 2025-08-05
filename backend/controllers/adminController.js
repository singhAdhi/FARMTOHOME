import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalUsers: total
        }
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching users'
      }
    });
  }
};
// @desc    Get all farmers
// @route   GET /api/admin/farmers
// @access  Private (Admin only)
const getAllFarmers = async (req, res) => {
  try {
    const { verified, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let filter = { role: 'farmer' };
    if (verified !== undefined) {
      filter['farmerDetails.isVerified'] = verified === 'true';
    }

    const farmers = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        farmers,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalFarmers: total
        }
      }
    });

  } catch (error) {
    console.error('Get all farmers error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching farmers'
      }
    });
  }
};

// @desc    Approve/Reject farmer
// @route   PUT /api/admin/farmers/:id/approve
// @access  Private (Admin only)
const approveFarmer = async (req, res) => {
  try {
    const { approved } = req.body;
    
    const farmer = await User.findById(req.params.id);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FARMER_NOT_FOUND',
          message: 'Farmer not found'
        }
      });
    }

    if (!farmer.farmerDetails) {
      farmer.farmerDetails = {};
    }
    
    farmer.farmerDetails.isVerified = approved;
    farmer.updatedAt = new Date();
    
    await farmer.save();

    res.json({
      success: true,
      data: farmer,
      message: `Farmer ${approved ? 'approved' : 'rejected'} successfully`
    });

  } catch (error) {
    console.error('Approve farmer error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error updating farmer status'
      }
    });
  }
};

// @desc    Ban/Unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private (Admin only)
const banUser = async (req, res) => {
  try {
    const { banned } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Prevent banning other admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CANNOT_BAN_ADMIN',
          message: 'Cannot ban admin users'
        }
      });
    }

    user.isActive = !banned;
    user.updatedAt = new Date();
    
    await user.save();

    res.json({
      success: true,
      data: user,
      message: `User ${banned ? 'banned' : 'unbanned'} successfully`
    });

  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error updating user status'
      }
    });
  }
};

// @desc    Get all products (admin view)
// @route   GET /api/admin/products
// @access  Private (Admin only)
const getAllProducts = async (req, res) => {
  try {
    const { approved, category, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let filter = {};
    if (approved !== undefined) {
      filter.isApproved = approved === 'true';
    }
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate('farmer', 'name email farmerDetails.isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

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
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching products'
      }
    });
  }
};

// @desc    Approve/Reject product
// @route   PUT /api/admin/products/:id/approve
// @access  Private (Admin only)
const approveProduct = async (req, res) => {
  try {
    const { approved } = req.body;
    
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

    product.isApproved = approved;
    product.updatedAt = new Date();
    
    await product.save();

    res.json({
      success: true,
      data: product,
      message: `Product ${approved ? 'approved' : 'rejected'} successfully`
    });

  } catch (error) {
    console.error('Approve product error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error updating product status'
      }
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin only)
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

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name')
      .populate('items.farmer', 'name')
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
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching orders'
      }
    });
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getPlatformAnalytics = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const verifiedFarmers = await User.countDocuments({ 
      role: 'farmer', 
      'farmerDetails.isVerified': true 
    });

    // Product statistics
    const totalProducts = await Product.countDocuments();
    const approvedProducts = await Product.countDocuments({ isApproved: true });
    const pendingProducts = await Product.countDocuments({ isApproved: false });

    // Order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    // Revenue calculation (simplified)
    const completedOrdersData = await Order.find({ status: 'delivered' });
    let totalRevenue = 0;
    completedOrdersData.forEach(order => {
      totalRevenue += order.total;
    });

    // Recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Category distribution
    const categoryStats = await Product.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          farmers: totalFarmers,
          customers: totalCustomers,
          verifiedFarmers
        },
        products: {
          total: totalProducts,
          approved: approvedProducts,
          pending: pendingProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          recent: recentOrders
        },
        revenue: {
          total: totalRevenue
        },
        categories: categoryStats
      }
    });

  } catch (error) {
    console.error('Get platform analytics error:', error);
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
  getAllUsers,
  getAllFarmers,
  approveFarmer,
  banUser,
  getAllProducts, 
  approveProduct,
  deleteProduct,
  getAllOrders,
  getPlatformAnalytics
}; 