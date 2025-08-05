# 🛡️ Zod Validation Guide for Farm to Home Backend

## 🎯 **What is Zod?**

Zod is a **TypeScript-first schema validation library** that provides:
- **Type-safe validation** with better error messages
- **Data transformation** (string to number, trim, etc.)
- **Complex validation rules** (regex, custom logic)
- **Better developer experience** compared to express-validator

---

## 📁 **Your Complete Zod Setup**

```
backend/
├── validations/
│   ├── authValidation.js      ✅ User auth schemas
│   ├── productValidation.js   ✅ Product schemas
│   ├── cartValidation.js      ✅ Cart schemas
│   └── orderValidation.js     ✅ Order schemas
├── middleware/
│   └── validateZod.js         ✅ Zod validation middleware
├── controllers/
│   └── [updated to remove express-validator]
└── routes/
    └── [updated to use Zod middleware]
```

---

## 🔧 **How Zod Validation Works**

### **Before (express-validator):**
```javascript
// Route with express-validator
router.post('/register', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6+ characters').isLength({ min: 6 })
], register);

// Controller with validation check
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... rest of logic
};
```

### **After (Zod):**
```javascript
// Schema definition (once)
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').trim(),
    email: z.string().email('Please provide a valid email').toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')
  })
});

// Route (clean)
router.post('/register', validateZod(registerSchema), register);

// Controller (no validation logic needed!)
const register = async (req, res) => {
  // Data is already validated and transformed
  const { name, email, password } = req.body;
  // ... business logic only
};
```

---

## 🎨 **Zod Schema Examples**

### **🔐 Authentication Schemas**

```javascript
// Registration with complex validation
const registerSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .trim(),
    
    email: z.string()
      .email('Please provide a valid email')
      .toLowerCase(), // Automatically converts to lowercase
    
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
        'Password must contain uppercase, lowercase, and number'),
    
    role: z.enum(['customer', 'farmer']).default('customer'),
    
    phone: z.string()
      .regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile number required')
      .optional(),
    
    // Nested object validation
    address: z.object({
      street: z.string().min(5).optional(),
      city: z.string().min(2).optional(),
      pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional()
    }).optional()
  })
});
```

### **📦 Product Schemas**

```javascript
// Product creation with categories and advanced validation
const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim(),
    description: z.string().min(10).max(1000).trim(),
    price: z.number().positive('Price must be greater than 0').max(100000),
    
    category: z.enum([
      'vegetables', 'fruits', 'grains', 'pulses', 'spices', 'herbs'
    ]),
    
    unit: z.enum(['kg', 'gram', 'quintal', 'piece', 'dozen', 'liter']),
    
    stock: z.number().min(0).max(100000),
    
    images: z.array(z.string().url()).min(1).max(5).optional().default([]),
    
    isOrganic: z.boolean().optional().default(false),
    
    tags: z.array(z.string().min(2)).max(10).optional().default([]),
    
    // Advanced validation with custom logic
    harvestDate: z.string().datetime().optional(),
    expiryDate: z.string().datetime().optional()
  }).refine(
    (data) => {
      // Custom validation: expiry after harvest
      if (data.harvestDate && data.expiryDate) {
        return new Date(data.expiryDate) > new Date(data.harvestDate);
      }
      return true;
    },
    {
      message: "Expiry date must be after harvest date",
      path: ["expiryDate"]
    }
  )
});
```

### **🛒 Cart & Order Schemas**

```javascript
// Add to cart with quantity validation
const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    quantity: z.number().int().min(1).max(1000)
  })
});

// Place order with delivery address
const placeOrderSchema = z.object({
  body: z.object({
    deliveryAddress: z.object({
      name: z.string().min(2).max(50).trim(),
      phone: z.string().regex(/^[6-9]\d{9}$/),
      street: z.string().min(5).max(200).trim(),
      city: z.string().min(2).max(50).trim(),
      state: z.string().min(2).max(50).trim(),
      pincode: z.string().regex(/^\d{6}$/),
      coordinates: z.array(z.number()).length(2).optional()
    }),
    
    paymentMethod: z.enum(['card', 'upi', 'wallet', 'cod']).default('cod'),
    instructions: z.string().max(500).optional()
  })
});
```

### **🔍 Query Parameter Validation**

```javascript
// GET /api/products with filters and pagination
const getProductsQuerySchema = z.object({
  query: z.object({
    category: z.enum(['vegetables', 'fruits', 'grains']).optional(),
    
    price_min: z.string()
      .regex(/^\d+(\.\d{1,2})?$/)
      .transform(val => parseFloat(val)) // Auto-convert to number
      .optional(),
    
    price_max: z.string()
      .regex(/^\d+(\.\d{1,2})?$/)
      .transform(val => parseFloat(val))
      .optional(),
    
    search: z.string().min(2).max(50).optional(),
    
    sort_by: z.enum(['price', 'createdAt', 'name']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
    
    page: z.string()
      .regex(/^\d+$/)
      .transform(val => parseInt(val)) // Auto-convert to number
      .default(1),
    
    limit: z.string()
      .regex(/^\d+$/)
      .transform(val => parseInt(val))
      .refine(val => val >= 1 && val <= 100) // Custom validation
      .default(20)
  }).refine(
    (data) => {
      // Ensure min price ≤ max price
      if (data.price_min && data.price_max) {
        return data.price_min <= data.price_max;
      }
      return true;
    },
    {
      message: "Min price must be ≤ max price",
      path: ["price_min"]
    }
  )
});
```

---

## 🛠️ **Using Zod Middleware**

### **5 Ways to Validate:**

```javascript
const {
  validateZod,     // Full request validation (body + params + query)
  validateBody,    // Only body validation
  validateParams,  // Only URL parameters
  validateQuery,   // Only query parameters
  validateFile     // File upload validation
} = require('../middleware/validateZod');

// 1. Full request validation
router.post('/products', validateZod(createProductSchema), createProduct);

// 2. Body only
router.post('/login', validateBody(loginBodySchema), login);

// 3. Params only
router.get('/products/:id', validateParams(productParamsSchema), getProduct);

// 4. Query only
router.get('/products', validateQuery(productQuerySchema), getProducts);

// 5. File uploads
router.post('/upload', validateFile({
  required: true,
  maxFiles: 5,
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png']
}), uploadImages);
```

---

## 🎯 **Real Examples for Farm to Home**

### **Example 1: Farmer Product Creation**

```javascript
// Route: POST /api/farmer/products
router.post('/products', 
  auth,                                    // Authentication
  checkRole('farmer'),                     // Authorization
  validateZod(createProductSchema),        // Validation
  createProduct                            // Controller
);

// What happens:
// 1. User must be logged in (auth)
// 2. User must be a farmer (checkRole)
// 3. Request data is validated (validateZod)
// 4. Controller receives clean, validated data
```

### **Example 2: Customer Cart Management**

```javascript
// Route: POST /api/customer/cart
router.post('/cart',
  auth,
  checkRole('customer'),
  validateZod(addToCartSchema),
  addToCart
);

// Validates:
// - productId is valid MongoDB ObjectId
// - quantity is integer between 1-1000
// - User is authenticated customer
```

### **Example 3: Advanced Product Search**

```javascript
// Route: GET /api/products?category=vegetables&price_min=10&price_max=100
router.get('/',
  validateZod(getProductsQuerySchema),
  getProducts
);

// Automatically:
// - Converts price_min="10" to number 10
// - Validates category is in allowed list
// - Ensures price_min ≤ price_max
// - Sets default page=1, limit=20
```

---

## 📋 **Error Response Format**

Zod validation returns **consistent error format**:

```javascript
// When validation fails:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "body.email",
        "message": "Please provide a valid email",
        "code": "invalid_string",
        "value": "not-an-email"
      },
      {
        "field": "body.password",
        "message": "Password must be at least 6 characters",
        "code": "too_small",
        "value": "123"
      }
    ]
  }
}
```

---

## 🚀 **Migrating from express-validator**

### **Step-by-Step Migration:**

1. **Install Zod:**
   ```bash
   npm install zod
   ```

2. **Create validation schemas:**
   ```javascript
   // validations/authValidation.js
   const { z } = require('zod');
   const registerSchema = z.object({...});
   ```

3. **Create middleware:**
   ```javascript
   // middleware/validateZod.js
   const validateZod = (schema) => { ... };
   ```

4. **Update routes:**
   ```javascript
   // Before
   router.post('/register', [check('email').isEmail()], register);
   
   // After
   router.post('/register', validateZod(registerSchema), register);
   ```

5. **Clean up controllers:**
   ```javascript
   // Remove validationResult checks
   const register = async (req, res) => {
     // const errors = validationResult(req); ❌ Remove this
     const { email, password } = req.body; // ✅ Data is already clean
   };
   ```

---

## 💡 **Pro Tips**

### **1. Schema Reusability:**
```javascript
// Create reusable sub-schemas
const addressSchema = z.object({
  street: z.string().min(5),
  city: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/)
});

// Use in multiple schemas
const userSchema = z.object({
  name: z.string(),
  address: addressSchema.optional()
});

const orderSchema = z.object({
  deliveryAddress: addressSchema,
  // ... other fields
});
```

### **2. Environment-specific Validation:**
```javascript
const productSchema = z.object({
  name: z.string().min(2),
  price: process.env.NODE_ENV === 'development' 
    ? z.number().min(0)      // Allow free in dev
    : z.number().min(1)      // Require payment in prod
});
```

### **3. Custom Error Messages:**
```javascript
const passwordSchema = z.string()
  .min(6, 'Password too short')
  .max(100, 'Password too long')
  .regex(/[A-Z]/, 'Need uppercase letter')
  .regex(/[a-z]/, 'Need lowercase letter')
  .regex(/\d/, 'Need at least one number');
```

---

## 🎉 **Benefits You Get**

✅ **Type Safety** - Catch errors at validation time  
✅ **Auto Transformation** - Convert strings to numbers automatically  
✅ **Better Error Messages** - Clear, specific validation errors  
✅ **Cleaner Controllers** - No validation logic in business code  
✅ **Consistent API** - Same error format across all endpoints  
✅ **Advanced Validation** - Complex rules, nested objects, custom logic  
✅ **Better Developer Experience** - Less boilerplate, more features  

Your Farm to Home backend now has **enterprise-level validation** that's both powerful and easy to use! 🌾🛡️ 