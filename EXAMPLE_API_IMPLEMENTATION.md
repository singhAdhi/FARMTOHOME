# 🛠️ Real Example: Building Product API from Scratch

## 🎯 **Planning the GET /api/products Endpoint**

### **Step 1: Define Requirements**
```
What should this API do?
├── Return list of all products
├── Support filtering (category, location, price)
├── Support pagination (page, limit)
├── Support search (by name, description)
├── Support sorting (price, date, rating)
└── Work for both authenticated and guest users
```

### **Step 2: Design the URL Structure**
```javascript
// Base endpoint
GET /api/products

// With query parameters
GET /api/products?category=grains&location=bihar&price_min=100&price_max=500&search=makhana&sort_by=price&order=asc&page=1&limit=20
```

### **Step 3: Define Response Format**
```javascript
// Success Response
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "64f...",
        "name": "Fresh Makhana",
        "description": "Organic makhana from Bihar",
        "price": 800,
        "unit": "kg",
        "category": "grains",
        "farmer": {
          "id": "64e...",
          "name": "Ram Kumar",
          "location": "Madhubani, Bihar",
          "rating": 4.5
        },
        "images": ["image1.jpg"],
        "stock": 50,
        "isOrganic": true,
        "createdAt": "2023-10-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 98,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "availableCategories": ["grains", "vegetables", "fruits"],
      "priceRange": { "min": 50, "max": 2000 },
      "locations": ["bihar", "up", "west-bengal"]
    }
  }
}
```

---

## 💻 **Step 4: Implementation Code**

### **Route Definition**
```javascript
// backend/routes/products.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Extract query parameters
    const {
      category,
      location,
      price_min,
      price_max,
      search,
      sort_by = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20,
      farmer_id
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Category filter
    if (category) {
      filter.category = category;
    }
    
    // Price range filter
    if (price_min || price_max) {
      filter.price = {};
      if (price_min) filter.price.$gte = parseFloat(price_min);
      if (price_max) filter.price.$lte = parseFloat(price_max);
    }
    
    // Search filter (name or description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Farmer filter
    if (farmer_id) {
      filter.farmer = farmer_id;
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sort_by]: sortOrder };

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with aggregation for farmer location filter
    let aggregationPipeline = [
      // Lookup farmer data
      {
        $lookup: {
          from: 'users',
          localField: 'farmer',
          foreignField: '_id',
          as: 'farmer'
        }
      },
      { $unwind: '$farmer' },
      
      // Match filters
      { $match: filter }
    ];

    // Add location filter if provided
    if (location) {
      aggregationPipeline.push({
        $match: {
          'farmer.location': { $regex: location, $options: 'i' }
        }
      });
    }

    // Add sorting and pagination
    aggregationPipeline.push(
      { $sort: sort },
      { $skip: skip },
      { $limit: limitNum }
    );

    // Execute the aggregation
    const products = await Product.aggregate(aggregationPipeline);

    // Get total count for pagination
    const totalPipeline = [...aggregationPipeline];
    totalPipeline.pop(); // Remove limit
    totalPipeline.pop(); // Remove skip
    totalPipeline.push({ $count: "total" });
    
    const totalResult = await Product.aggregate(totalPipeline);
    const totalItems = totalResult.length > 0 ? totalResult[0].total : 0;

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    // Get filter metadata
    const availableCategories = await Product.distinct('category');
    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          min: { $min: '$price' },
          max: { $max: '$price' }
        }
      }
    ]);

    const availableLocations = await Product.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'farmer',
          foreignField: '_id',
          as: 'farmer'
        }
      },
      { $unwind: '$farmer' },
      {
        $group: {
          _id: '$farmer.location'
        }
      }
    ]);

    // Format response
    const response = {
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems,
          itemsPerPage: limitNum,
          hasNext,
          hasPrev
        },
        filters: {
          availableCategories,
          priceRange: priceRange.length > 0 ? priceRange[0] : { min: 0, max: 0 },
          locations: availableLocations.map(loc => loc._id)
        }
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching products'
      }
    });
  }
});

module.exports = router;
```

### **Enhanced Product Model (if needed)**
```javascript
// backend/models/Product.js - Add indexes for better performance
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true // For search performance
  },
  description: {
    type: String,
    required: true,
    index: true // For search performance
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true // For price filtering
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'herbs'],
    index: true // For category filtering
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // For farmer filtering
  },
  // ... other fields
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // For sorting by date
  }
});

// Compound indexes for common query patterns
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ farmer: 1, createdAt: -1 });
ProductSchema.index({ name: 'text', description: 'text' }); // Text search

module.exports = mongoose.model('Product', ProductSchema);
```

---

## 🧪 **Step 5: Testing the API**

### **Test Cases to Consider**
```javascript
// Test 1: Basic retrieval
GET /api/products
// Should return paginated products

// Test 2: Category filtering
GET /api/products?category=grains
// Should return only grain products

// Test 3: Price filtering
GET /api/products?price_min=100&price_max=500
// Should return products in price range

// Test 4: Search functionality
GET /api/products?search=makhana
// Should return products matching search term

// Test 5: Combined filters
GET /api/products?category=grains&location=bihar&price_min=500&search=organic&page=2&limit=10

// Test 6: Sorting
GET /api/products?sort_by=price&order=asc
// Should return products sorted by price ascending

// Test 7: Invalid parameters
GET /api/products?page=-1&limit=1000
// Should handle gracefully
```

### **Using Postman/Thunder Client**
```javascript
// Create a collection with these requests:
1. GET Basic Products List
2. GET Products with Category Filter  
3. GET Products with Price Range
4. GET Products with Search
5. GET Products with All Filters
6. GET Products with Invalid Params
```

---

## 🔧 **Step 6: Error Handling & Validation**

### **Input Validation Middleware**
```javascript
// middleware/validateQuery.js
const { query, validationResult } = require('express-validator');

const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('price_min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('price_max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  query('category')
    .optional()
    .isIn(['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'herbs'])
    .withMessage('Invalid category'),
  
  query('sort_by')
    .optional()
    .isIn(['name', 'price', 'createdAt', 'rating'])
    .withMessage('Invalid sort field'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: errors.array()
        }
      });
    }
    next();
  }
];

module.exports = { validateProductQuery };
```

### **Use in Route**
```javascript
// backend/routes/products.js
const { validateProductQuery } = require('../middleware/validateQuery');

router.get('/', validateProductQuery, async (req, res) => {
  // ... implementation
});
```

---

## 📊 **Step 7: Performance Optimization**

### **Add Caching**
```javascript
// middleware/cache.js
const redis = require('redis');
const client = redis.createClient();

const cacheProducts = (duration = 300) => { // 5 minutes default
  return async (req, res, next) => {
    const key = `products:${JSON.stringify(req.query)}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Store original res.json
      const originalJson = res.json;
      res.json = function(body) {
        // Cache the response
        client.setex(key, duration, JSON.stringify(body));
        // Call original json method
        originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      next(); // Continue without cache on error
    }
  };
};

// Use in route
router.get('/', cacheProducts(300), validateProductQuery, async (req, res) => {
  // ... implementation
});
```

This example shows you the **complete thought process** from planning to production-ready code! 🚀 