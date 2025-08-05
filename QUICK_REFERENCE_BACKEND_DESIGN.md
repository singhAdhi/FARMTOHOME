# 🚀 Quick Reference: Backend Design Questions

## 🎯 **For ANY Project - Ask These Questions First**

### **🔍 Step 1: Business Analysis (5 minutes)**
```
❓ Who uses this system? (List all user types)
❓ What does each user type want to do? (Main actions)
❓ What business rules exist? (Constraints/permissions)
❓ What external systems needed? (Payments, notifications, etc.)
❓ How many users expected? (Scale requirements)
```

### **🗄️ Step 2: Database Design (20 minutes)**
```
❓ What "things" exist in this domain? (Entities)
❓ What info do I need about each thing? (Attributes)
❓ How are these things connected? (Relationships)
❓ Which queries will be most common? (Indexes)
❓ What data cannot be wrong? (Validation rules)
```

### **🔄 Step 3: API Design (15 minutes)**
```
❓ What can each user type do? (Permissions)
❓ How to group similar operations? (URL structure)
❓ What data goes in/out of each operation? (Request/Response)
❓ How to handle failures? (Error responses)
❓ What needs protection? (Authentication)
```

---

## 📝 **Templates for Common Scenarios**

### **🛒 E-commerce/Marketplace Template**
```javascript
// Entities: User, Product, Order, Review, Payment, Category
// User Types: Customer, Seller, Admin
// Core APIs: Auth, Products, Orders, Payments, Reviews

// Database Schema Pattern:
Users → has role (customer/seller/admin)
Products → belongs to seller, has category
Orders → has customer, contains products, has status
Reviews → customer reviews product after purchase
```

### **📱 Social Media Template**
```javascript
// Entities: User, Post, Comment, Like, Follow, Message
// User Types: Regular User, Creator, Moderator, Admin
// Core APIs: Auth, Posts, Social, Feed, Moderation

// Database Schema Pattern:
Users → can follow other users
Posts → belong to user, can have media
Comments → belong to post and user
Likes → many-to-many user-post relationship
```

### **🎓 Learning Platform Template**
```javascript
// Entities: User, Course, Lesson, Enrollment, Progress, Quiz
// User Types: Student, Instructor, Admin
// Core APIs: Auth, Courses, Learning, Progress, Payments

// Database Schema Pattern:
Users → has role (student/instructor)
Courses → created by instructor, has lessons
Enrollments → student enrolled in course
Progress → tracks student completion
```

---

## ⚡ **Quick Database Design Checklist**

### **For Each Entity, Define:**
- [ ] **Primary attributes** (required fields)
- [ ] **Optional attributes** (nice-to-have fields)
- [ ] **Relationships** (how it connects to other entities)
- [ ] **Indexes** (what fields will be searched/sorted)
- [ ] **Constraints** (what data rules exist)

### **Common Patterns:**
```javascript
// User entity (almost every app)
{
  email: String, // unique identifier
  password: String, // hashed
  role: String, // user type
  isActive: Boolean, // can disable users
  createdAt: Date, // audit trail
  updatedAt: Date // audit trail
}

// Order/Transaction entity (commerce apps)
{
  user: ObjectId, // who made the order
  items: [OrderItem], // what was ordered
  status: String, // workflow state
  total: Number, // calculated total
  createdAt: Date, // when ordered
  statusHistory: [StatusChange] // audit trail
}

// Content entity (social/cms apps)
{
  author: ObjectId, // who created it
  title: String, // what it's called
  content: String, // the actual content
  visibility: String, // who can see it
  isApproved: Boolean, // moderation state
  createdAt: Date, // when created
  updatedAt: Date // when last modified
}
```

---

## 🔄 **Quick API Design Checklist**

### **For Each User Type, List:**
- [ ] **What can they CREATE?**
- [ ] **What can they READ?**
- [ ] **What can they UPDATE?**
- [ ] **What can they DELETE?**

### **URL Patterns:**
```javascript
// Resource-based (preferred)
GET    /api/products        → Get all products
GET    /api/products/:id    → Get specific product
POST   /api/products        → Create new product
PUT    /api/products/:id    → Update product
DELETE /api/products/:id    → Delete product

// Role-based grouping
/api/auth/*                 → Authentication
/api/admin/*               → Admin-only operations
/api/seller/*              → Seller-only operations
/api/public/*              → Public data

// Nested resources
GET    /api/products/:id/reviews    → Get product reviews
POST   /api/products/:id/reviews    → Add review to product
```

### **Response Format Template:**
```javascript
// Success response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "total": 100,
    "timestamp": "2023-10-15T10:30:00Z"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
```

---

## 🔐 **Security & Validation Checklist**

### **Authentication:**
- [ ] JWT tokens for session management
- [ ] Password hashing (bcrypt)
- [ ] Email/phone verification
- [ ] Password reset flow

### **Authorization:**
- [ ] Role-based access control
- [ ] Resource ownership checks
- [ ] Admin override capabilities

### **Input Validation:**
- [ ] Required field validation
- [ ] Data type validation
- [ ] Business rule validation
- [ ] Sanitization (prevent XSS)

### **Error Handling:**
- [ ] Consistent error format
- [ ] Appropriate HTTP status codes
- [ ] No sensitive data in errors
- [ ] Logging for debugging

---

## 🚀 **Implementation Order (For Any Project)**

### **Phase 1: Foundation (Week 1)**
1. Set up project structure
2. Design & implement User entity
3. Build authentication APIs
4. Set up database with basic collections

### **Phase 2: Core Business Logic (Week 2-3)**
1. Design & implement main entities
2. Build CRUD APIs for core features
3. Add input validation
4. Implement role-based access control

### **Phase 3: Business Features (Week 4-6)**
1. Add complex business logic
2. Implement search/filtering
3. Add file upload capabilities
4. Build admin management features

### **Phase 4: Polish & Scale (Week 7-8)**
1. Add caching where needed
2. Implement comprehensive error handling
3. Add monitoring/logging
4. Performance optimization

---

## 💡 **Pro Tips for Beginners**

### **Database Design:**
- ✅ Start simple, add complexity later
- ✅ Use consistent naming conventions
- ✅ Always include audit fields (createdAt, updatedAt)
- ✅ Plan for soft deletes (isDeleted flag)
- ❌ Don't over-normalize initially
- ❌ Don't forget to add indexes

### **API Design:**
- ✅ Be consistent with URL patterns
- ✅ Use proper HTTP status codes
- ✅ Version your APIs from day 1
- ✅ Document as you build
- ❌ Don't put verbs in URLs
- ❌ Don't expose internal IDs unnecessarily

### **Security:**
- ✅ Validate everything on the server
- ✅ Use HTTPS everywhere
- ✅ Implement rate limiting
- ✅ Log security events
- ❌ Never trust client-side validation
- ❌ Never store passwords in plain text

This quick reference will help you tackle ANY backend project systematically! 🎯 