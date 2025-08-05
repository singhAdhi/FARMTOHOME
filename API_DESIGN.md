# 🚀 Farm to Home - Complete API Design

## 🎯 **API Design Thinking Process**

### **Step 1: Identify Entities**
```
Users/Authentication:
├── User (Customer)
├── Farmer
├── Admin

Core Business:
├── Product
├── Category
├── Order
├── OrderItem
├── Cart
├── Review
├── Payment

Supporting:
├── Address
├── Notification
├── MandiPrice
└── Analytics
```

### **Step 2: Map Roles to Permissions**
| Entity | Customer | Farmer | Admin |
|--------|----------|--------|-------|
| Product | Read | CRUD (own) | CRUD (all) |
| Order | CRUD (own) | Read (received) | CRUD (all) |
| User | Update (own) | Update (own) | CRUD (all) |
| Review | CRUD (own) | Read | CRUD (all) |

---

## 🔐 **Authentication APIs**

### **User Management**
```javascript
// Registration & Login
POST   /api/auth/register          // Register new user
POST   /api/auth/login             // Login user
POST   /api/auth/logout            // Logout user
GET    /api/auth/profile           // Get current user profile
PUT    /api/auth/profile           // Update current user profile
POST   /api/auth/forgot-password   // Send reset password email
POST   /api/auth/reset-password    // Reset password with token
POST   /api/auth/change-password   // Change password (authenticated)

// Email & Phone Verification
POST   /api/auth/verify-email      // Verify email address
POST   /api/auth/verify-phone      // Verify phone number
POST   /api/auth/resend-otp        // Resend OTP

// Admin only
GET    /api/admin/users            // Get all users (paginated)
GET    /api/admin/users/:id        // Get specific user
PUT    /api/admin/users/:id        // Update any user
DELETE /api/admin/users/:id        // Delete user
PUT    /api/admin/users/:id/status // Activate/Deactivate user
```

---

## 📦 **Product Management APIs**

### **Categories**
```javascript
// Public
GET    /api/categories             // Get all categories
GET    /api/categories/:id         // Get category by ID

// Admin only
POST   /api/admin/categories       // Create category
PUT    /api/admin/categories/:id   // Update category
DELETE /api/admin/categories/:id   // Delete category
```

### **Products**
```javascript
// Public (Customers & Guests)
GET    /api/products               // Get all products (with filters)
GET    /api/products/:id           // Get single product
GET    /api/products/search        // Search products
GET    /api/products/featured      // Get featured products
GET    /api/products/farmer/:farmerId // Get products by farmer

// Query Parameters for GET /api/products:
// ?category=vegetables&location=bihar&price_min=10&price_max=100
// &sort_by=price&order=asc&page=1&limit=20&search=makhana

// Farmer only (own products)
GET    /api/farmer/products        // Get farmer's own products
POST   /api/farmer/products        // Create new product
PUT    /api/farmer/products/:id    // Update own product
DELETE /api/farmer/products/:id    // Delete own product
PUT    /api/farmer/products/:id/status // Update product status (active/inactive)

// Bulk operations for farmers
POST   /api/farmer/products/bulk   // Bulk upload products (CSV)
PUT    /api/farmer/products/bulk-update // Bulk update prices/stock

// Admin only
GET    /api/admin/products         // Get all products with admin details
PUT    /api/admin/products/:id/approve // Approve/Reject product
DELETE /api/admin/products/:id     // Delete any product
```

---

## 🛒 **Order Management APIs**

### **Cart Operations**
```javascript
// Customer only
GET    /api/cart                   // Get customer's cart
POST   /api/cart/items             // Add item to cart
PUT    /api/cart/items/:id         // Update cart item quantity
DELETE /api/cart/items/:id         // Remove item from cart
DELETE /api/cart                   // Clear entire cart
```

### **Orders**
```javascript
// Customer operations
GET    /api/orders                 // Get customer's order history
GET    /api/orders/:id             // Get specific order details
POST   /api/orders                 // Create new order from cart
PUT    /api/orders/:id/cancel      // Cancel order (if allowed)

// Farmer operations
GET    /api/farmer/orders          // Get orders for farmer's products
PUT    /api/farmer/orders/:id/status // Update order status (accepted/rejected/shipped)
GET    /api/farmer/orders/analytics // Order analytics for farmer

// Admin operations
GET    /api/admin/orders           // Get all orders
GET    /api/admin/orders/analytics // Platform-wide order analytics
PUT    /api/admin/orders/:id/resolve // Resolve order disputes
```

### **Order Status Flow**
```javascript
Order Status Progression:
pending → accepted → processing → shipped → delivered → completed
       ↘ rejected
       ↘ cancelled (customer)
       ↘ dispute → resolved
```

---

## 💳 **Payment APIs**

```javascript
// Payment Processing
POST   /api/payments/create        // Create payment intent
POST   /api/payments/verify        // Verify payment status
GET    /api/payments/history       // Get payment history
POST   /api/payments/refund        // Process refund

// Farmer Payouts
GET    /api/farmer/earnings        // Get farmer earnings
GET    /api/farmer/payouts         // Get payout history
POST   /api/farmer/payouts/request // Request payout

// Admin Financial Management
GET    /api/admin/payments         // All platform payments
GET    /api/admin/payouts          // All farmer payouts
POST   /api/admin/payouts/process  // Process farmer payout
GET    /api/admin/financial-reports // Financial analytics
```

---

## ⭐ **Review & Rating APIs**

```javascript
// Customer operations
GET    /api/products/:id/reviews   // Get product reviews
POST   /api/products/:id/reviews   // Add product review
PUT    /api/reviews/:id            // Update own review
DELETE /api/reviews/:id            // Delete own review

// Farmer operations
GET    /api/farmer/reviews         // Get reviews for farmer's products
POST   /api/farmer/reviews/:id/reply // Reply to customer review

// Admin operations
GET    /api/admin/reviews          // Get all reviews
DELETE /api/admin/reviews/:id      // Delete inappropriate review
PUT    /api/admin/reviews/:id/moderate // Moderate review content
```

---

## 🌾 **Mandi Price Integration APIs**

```javascript
// Public access
GET    /api/mandi-prices           // Get current mandi prices
GET    /api/mandi-prices/history   // Historical price data
GET    /api/mandi-prices/compare   // Compare product prices with mandi

// Admin operations
POST   /api/admin/mandi-prices/sync // Sync with government APIs
PUT    /api/admin/mandi-prices/update // Manual price updates
```

---

## 📍 **Location & Address APIs**

```javascript
// Address Management
GET    /api/addresses              // Get customer addresses
POST   /api/addresses              // Add new address
PUT    /api/addresses/:id          // Update address
DELETE /api/addresses/:id          // Delete address
PUT    /api/addresses/:id/default  // Set as default address

// Location Services
GET    /api/locations/states       // Get all states
GET    /api/locations/districts/:stateId // Get districts by state
GET    /api/locations/pincodes/:districtId // Get pincodes
GET    /api/locations/delivery-check // Check delivery availability
```

---

## 🔔 **Notification APIs**

```javascript
// Customer notifications
GET    /api/notifications          // Get user notifications
PUT    /api/notifications/:id/read // Mark as read
PUT    /api/notifications/mark-all-read // Mark all as read
DELETE /api/notifications/:id      // Delete notification

// Push notification settings
GET    /api/settings/notifications // Get notification preferences
PUT    /api/settings/notifications // Update preferences

// Admin broadcast
POST   /api/admin/notifications/broadcast // Send to all users
POST   /api/admin/notifications/targeted  // Send to specific users
```

---

## 📊 **Analytics & Reporting APIs**

```javascript
// Farmer Analytics
GET    /api/farmer/analytics/sales      // Sales analytics
GET    /api/farmer/analytics/products   // Product performance
GET    /api/farmer/analytics/customers  // Customer insights

// Admin Analytics
GET    /api/admin/analytics/platform    // Platform overview
GET    /api/admin/analytics/farmers     // Farmer performance
GET    /api/admin/analytics/revenue     // Revenue analytics
GET    /api/admin/analytics/growth      // Growth metrics
```

---

## 🛠️ **File Upload APIs**

```javascript
// Image/Document uploads
POST   /api/uploads/product-images     // Upload product images
POST   /api/uploads/profile-avatar    // Upload profile picture
POST   /api/uploads/documents         // Upload KYC documents
DELETE /api/uploads/:fileId           // Delete uploaded file

// Bulk operations
POST   /api/uploads/bulk-products     // Bulk product upload via CSV
GET    /api/uploads/csv-template      // Download CSV template
```

---

## 🔍 **Search & Filter APIs**

```javascript
// Advanced search
GET    /api/search/products          // Product search with filters
GET    /api/search/farmers           // Search farmers
GET    /api/search/suggestions       // Search autocomplete

// Filters and sorting
GET    /api/filters/categories       // Available categories
GET    /api/filters/price-range      // Price range for products
GET    /api/filters/locations        // Available locations
```

---

## 📱 **Mobile App Specific APIs**

```javascript
// App configuration
GET    /api/mobile/config            // App configuration
GET    /api/mobile/version           // Check app version
POST   /api/mobile/device-token      // Register FCM token

// Offline sync
GET    /api/mobile/sync              // Sync offline data
POST   /api/mobile/sync/conflicts    // Resolve sync conflicts
```

---

## 🚨 **Error Handling & Status Codes**

### **Standard HTTP Status Codes**
```javascript
200 - OK (Success)
201 - Created (New resource created)
400 - Bad Request (Invalid input)
401 - Unauthorized (Not logged in)
403 - Forbidden (No permission)
404 - Not Found (Resource doesn't exist)
409 - Conflict (Duplicate resource)
422 - Unprocessable Entity (Validation errors)
500 - Internal Server Error
```

### **Standard Error Response Format**
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

---

## 🔄 **API Versioning Strategy**

```javascript
// URL versioning (recommended)
/api/v1/products
/api/v2/products

// Header versioning (alternative)
Accept: application/vnd.farmtohome.v1+json
```

---

## 📋 **Request/Response Examples**

### **Create Product (Farmer)**
```javascript
// POST /api/farmer/products
{
  "name": "Fresh Makhana",
  "description": "Organic makhana from Bihar farms",
  "price": 800,
  "unit": "kg",
  "category": "grains",
  "stock": 50,
  "isOrganic": true,
  "images": ["image1.jpg", "image2.jpg"]
}

// Response
{
  "success": true,
  "data": {
    "id": "64f...",
    "name": "Fresh Makhana",
    "farmer": {
      "id": "64e...",
      "name": "Ram Kumar",
      "location": "Madhubani, Bihar"
    },
    "price": 800,
    "createdAt": "2023-10-15T10:30:00Z"
  }
}
```

### **Get Products with Filters**
```javascript
// GET /api/products?category=grains&location=bihar&page=1&limit=20

{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 98,
      "itemsPerPage": 20
    },
    "filters": {
      "categories": ["grains", "vegetables"],
      "priceRange": { "min": 50, "max": 2000 },
      "locations": ["bihar", "up", "west-bengal"]
    }
  }
}
```

---

## 🛡️ **Authentication & Security**

### **JWT Token Structure**
```javascript
// Token payload
{
  "user": {
    "id": "64f...",
    "role": "farmer", // customer, farmer, admin
    "email": "farmer@example.com"
  },
  "iat": 1697365800,
  "exp": 1697452200
}

// Headers required for protected routes
Authorization: Bearer <jwt_token>
```

### **Rate Limiting**
```javascript
// API rate limits
General APIs: 100 requests/minute
Search APIs: 60 requests/minute
Upload APIs: 10 requests/minute
Admin APIs: 1000 requests/minute
```

---

## 🚀 **Implementation Priority**

### **Phase 1 - Essential APIs**
1. Authentication (register, login)
2. Product CRUD operations
3. Basic order management
4. Payment integration

### **Phase 2 - Business Logic**
1. Cart management
2. Review system
3. Mandi price integration
4. Notification system

### **Phase 3 - Advanced Features**
1. Analytics APIs
2. Advanced search
3. Bulk operations
4. Mobile-specific APIs

This API design gives you a complete blueprint for building a scalable agricultural marketplace! 🌾 