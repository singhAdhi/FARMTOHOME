# 🎮 Controller Structure Guide

## 🏗️ **What are Controllers?**

Controllers are **the brain** of your API. They contain all the business logic for each route.

```
Route → Controller → Database → Response
```

Think of it like this:
- **Route**: "Someone wants to get products"
- **Controller**: "Let me fetch products from database and format the response"
- **Database**: "Here are the products"
- **Controller**: "Here's the formatted response"

---

## 📁 **Your Complete Controller Structure**

```
backend/
├── controllers/
│   ├── authController.js      → Authentication (register, login)
│   ├── productController.js   → Public product operations
│   ├── farmerController.js    → Farmer-specific operations
│   ├── customerController.js  → Customer-specific operations
│   └── adminController.js     → Admin-only operations
├── models/
│   ├── User.js               → User data structure
│   ├── Product.js            → Product data structure  
│   ├── Order.js              → Order data structure
│   └── Cart.js               → Cart data structure
└── routes/
    ├── auth.js               → Authentication routes
    ├── products.js           → Product routes
    ├── farmers.js            → Farmer routes
    ├── customers.js          → Customer routes
    └── admin.js              → Admin routes
```

---

## 🔗 **How Controllers Connect to Routes**

### **Example: Product Controller → Product Routes**

**Controller Function:**
```javascript
// controllers/productController.js
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: true });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
```

**Route Using Controller:**
```javascript
// routes/products.js
const express = require('express');
const { getProducts } = require('../controllers/productController');
const router = express.Router();

router.get('/', getProducts);  // GET /api/products

module.exports = router;
```

**Server Using Route:**
```javascript
// server.js
app.use('/api/products', require('./routes/products'));
```

---

## 🎯 **What Each Controller Does**

### **🔐 authController.js**
```javascript
Functions:
├── register()     → Create new user account
├── login()        → User login with JWT token
├── getProfile()   → Get current user info
└── updateProfile() → Update user profile
```

### **📦 productController.js (Public)**
```javascript
Functions:
├── getProducts()        → Get all approved products
├── getProduct()         → Get single product details
├── searchProducts()     → Search products by name/description
├── getProductsByFarmer() → Get products by specific farmer
└── getCategories()      → Get all product categories
```

### **👨‍🌾 farmerController.js (Farmer Only)**
```javascript
Functions:
├── getMyProducts()      → Get farmer's own products
├── createProduct()      → Add new product
├── updateProduct()      → Update own product
├── deleteProduct()      → Delete own product
├── getMyOrders()        → Get orders for farmer's products
├── updateOrderStatus()  → Update order status (shipped, etc.)
└── getAnalytics()       → Get farmer's sales analytics
```

### **🛒 customerController.js (Customer Only)**
```javascript
Functions:
├── getCart()          → Get customer's shopping cart
├── addToCart()        → Add product to cart
├── updateCartItem()   → Update cart item quantity
├── removeFromCart()   → Remove item from cart
├── getMyOrders()      → Get customer's order history
├── placeOrder()       → Create new order from cart
└── cancelOrder()      → Cancel pending order
```

### **👨‍💼 adminController.js (Admin Only)**
```javascript
Functions:
├── getAllUsers()        → Get all platform users
├── getAllFarmers()      → Get all farmers (verified/unverified)
├── approveFarmer()      → Approve/reject farmer
├── banUser()            → Ban/unban user account
├── getAllProducts()     → Get all products (approved/pending)
├── approveProduct()     → Approve/reject product
├── deleteProduct()      → Delete any product
├── getAllOrders()       → Get all platform orders
└── getPlatformAnalytics() → Get platform statistics
```

---

## 🔄 **Controller Pattern (Standard Structure)**

Every controller function follows this pattern:

```javascript
const functionName = async (req, res) => {
  try {
    // 1. Extract data from request
    const { param1, param2 } = req.body;
    const userId = req.user.id; // from auth middleware
    
    // 2. Validate data (if needed)
    if (!param1) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAM', message: 'Param1 is required' }
      });
    }
    
    // 3. Business logic (database operations)
    const result = await Model.find({ userId });
    
    // 4. Send response
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    // 5. Handle errors
    console.error('Function error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Something went wrong' }
    });
  }
};
```

---

## 🛠️ **How to Connect Controllers to Routes**

### **Step 1: Create Route File**
```javascript
// routes/farmers.js
const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/farmerController');

// Import middleware
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Connect routes to controller functions
router.get('/products', auth, checkRole('farmer'), getMyProducts);
router.post('/products', auth, checkRole('farmer'), createProduct);
router.put('/products/:id', auth, checkRole('farmer'), updateProduct);
router.delete('/products/:id', auth, checkRole('farmer'), deleteProduct);

module.exports = router;
```

### **Step 2: Register Route in Server**
```javascript
// server.js
app.use('/api/farmer', require('./routes/farmers'));
app.use('/api/customer', require('./routes/customers'));
app.use('/api/admin', require('./routes/admin'));
```

---

## ✅ **Your Next Steps**

### **Week 1: Connect Auth Controller**
1. Create `routes/auth.js`
2. Connect `authController` functions
3. Test register and login

### **Week 2: Connect Product Controllers**
1. Create `routes/products.js` (public)
2. Create `routes/farmers.js` (farmer routes)
3. Test product creation and listing

### **Week 3: Connect Customer Controller**
1. Create `routes/customers.js`
2. Test cart and order functionality

### **Week 4: Connect Admin Controller**
1. Create `routes/admin.js`
2. Test admin management features

---

## 🎯 **Benefits of This Structure**

### **✅ Organized Code:**
- Each user type has its own controller
- Easy to find and modify functions
- Clear separation of concerns

### **✅ Reusable Functions:**
- Controllers can be used by multiple routes
- Easy to test individual functions
- Clean, maintainable code

### **✅ Security:**
- Role-based access control
- Input validation in controllers
- Consistent error handling

### **✅ Scalability:**
- Easy to add new features
- Simple to modify existing functionality
- Clear code structure for team development

---

## 💡 **Pro Tips**

### **Keep Controllers Focused:**
- One controller per user type/domain
- Each function does one thing well
- Consistent naming conventions

### **Handle Errors Properly:**
- Always use try-catch blocks
- Consistent error response format
- Log errors for debugging

### **Validate Input:**
- Check required fields
- Validate data types
- Check user permissions

### **Use Middleware:**
- Authentication checks
- Role-based access control
- Input validation

This controller structure will make your Farm to Home API super organized and easy to maintain! 🚀 