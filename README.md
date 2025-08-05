# Farm to Home - MERN Stack Application

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for connecting farmers directly with consumers.

## 🚀 Features

- User authentication (farmers, customers, admin)
- Product management for farmers
- Product browsing for customers
- Responsive design
- RESTful API
- JWT authentication

## 📁 Project Structure

```
FARMTOHOME/
│
├── backend/                 # Express.js API server
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Main server file
│
├── frontend/              # React.js client application
│   ├── public/           # Public assets
│   ├── src/              # React source code
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main App component
│   └── package.json      # Frontend dependencies
│
├── package.json           # Root package.json for scripts
└── README.md              # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FARMTOHOME
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/farmtohome
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start both the backend server (port 5000) and frontend development server (port 3000).

## 🎯 API Endpoints

### Authentication
- `POST /api/users` - Register user
- `POST /api/auth` - Login user
- `GET /api/auth` - Get authenticated user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (farmers only)
- `PUT /api/products/:id` - Update product (farmers only)
- `DELETE /api/products/:id` - Delete product (farmers only)

## 🧪 Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run install-all` - Install dependencies for both frontend and backend
- `npm run build` - Build the frontend for production

## 🏗️ Built With

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing

### Frontend
- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## 🚀 Deployment

The application is configured for deployment on platforms like Heroku, Vercel, or Netlify.

For Heroku deployment:
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Deploy

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🗺️ Development Roadmap

### 🎯 **Vision**: Direct Farmer-to-Consumer Marketplace for Bihar

Eliminate middlemen from the agricultural supply chain, ensuring farmers get fair prices and consumers get fresh produce directly from farms.

---

## 📋 **Phase 1: MVP Foundation (Months 1-3)**

### ✅ **Completed**
- [x] Basic MERN stack setup
- [x] User authentication (JWT)
- [x] Basic product CRUD operations
- [x] Role-based access (Farmer/Customer)
- [x] Responsive UI design
- [x] Basic dashboard functionality

### 🔄 **In Progress**
- [ ] **Environment & Deployment Setup**
  - [ ] Production environment configuration
  - [ ] MongoDB Atlas setup
  - [ ] Deploy to Heroku/Vercel/AWS
  - [ ] Domain setup and SSL certificates
  - [ ] Environment variables management

### 🎯 **Next Steps**
- [ ] **Core Business Logic**
  - [ ] Enhanced product categorization (Grains, Vegetables, Fruits, Dairy)
  - [ ] Product image upload (Cloudinary integration)
  - [ ] Inventory management system
  - [ ] Basic order management
  - [ ] Order status tracking

- [ ] **Payment Integration**
  - [ ] Razorpay/Stripe payment gateway
  - [ ] Escrow payment system
  - [ ] Farmer payout management
  - [ ] Invoice generation

- [ ] **Farmer Verification System**
  - [ ] KYC document upload
  - [ ] Farm location verification (GPS)
  - [ ] Bank account verification
  - [ ] Government ID validation

---

## 📈 **Phase 2: Marketplace Enhancement (Months 4-6)**

### 🔧 **Core Features**
- [ ] **Mandi Price Integration**
  - [ ] Government mandi price API integration
  - [ ] Real-time price comparison dashboard
  - [ ] Historical price trends
  - [ ] Price alerts for farmers

- [ ] **Advanced Product Management**
  - [ ] Bulk product upload (CSV)
  - [ ] Seasonal availability tracking
  - [ ] Product variants (quality grades)
  - [ ] Multiple product images/videos

- [ ] **Order & Logistics**
  - [ ] Bulk order system for B2B buyers
  - [ ] Order scheduling and batching
  - [ ] Basic logistics integration (manual)
  - [ ] Delivery tracking system

- [ ] **Quality Assurance**
  - [ ] Product quality ratings
  - [ ] Customer review system
  - [ ] Return/refund management
  - [ ] Quality certificate uploads

### 🎨 **UI/UX Enhancements**
- [ ] **Advanced Search & Filtering**
  - [ ] Location-based product search
  - [ ] Price range filtering
  - [ ] Category and subcategory filters
  - [ ] Farmer rating filters

- [ ] **Dashboard Improvements**
  - [ ] Advanced analytics for farmers
  - [ ] Sales reporting and insights
  - [ ] Customer behavior analytics
  - [ ] Revenue tracking

### 📱 **Communication System**
- [ ] **Messaging & Notifications**
  - [ ] In-app messaging between farmers and buyers
  - [ ] SMS notifications for order updates
  - [ ] Email notification system
  - [ ] WhatsApp integration for order updates

---

## 🚀 **Phase 3: Scale & Automation (Months 7-12)**

### 🤖 **AI & Automation**
- [ ] **Intelligent Systems**
  - [ ] AI-based price prediction
  - [ ] Demand forecasting
  - [ ] Crop recommendation system
  - [ ] Automated inventory alerts

- [ ] **Advanced Analytics**
  - [ ] Market trend analysis
  - [ ] Farmer performance metrics
  - [ ] Customer lifetime value tracking
  - [ ] Predictive analytics dashboard

### 🚚 **Logistics & Supply Chain**
- [ ] **Third-party Logistics Integration**
  - [ ] Delhivery API integration
  - [ ] Blue Dart/FedEx integration
  - [ ] Local courier partnerships
  - [ ] Real-time shipment tracking

- [ ] **Cold Chain Management**
  - [ ] Temperature-controlled logistics
  - [ ] Packaging standard verification
  - [ ] Quality preservation tracking
  - [ ] Insurance integration for perishables

### 📱 **Mobile & Multi-platform**
- [ ] **Mobile Applications**
  - [ ] React Native mobile app
  - [ ] Offline functionality for farmers
  - [ ] Push notifications
  - [ ] QR code scanning for products

- [ ] **Multi-language Support**
  - [ ] Hindi language support
  - [ ] Bhojpuri/Maithili regional languages
  - [ ] Voice-based product listing
  - [ ] Regional UI/UX adaptations

### 🔗 **External Integrations**
- [ ] **Government & Financial**
  - [ ] e-NAM (National Agriculture Market) integration
  - [ ] PM-KISAN database integration
  - [ ] Banking API for direct farmer payments
  - [ ] GST compliance and invoice generation

- [ ] **Weather & Agriculture Data**
  - [ ] Weather API integration
  - [ ] Crop calendar integration
  - [ ] Soil health data integration
  - [ ] Satellite imagery for farm verification

---

## 🏗️ **Phase 4: Enterprise & Expansion (Months 13-18)**

### 🌐 **Geographic Expansion**
- [ ] **Multi-state Rollout**
  - [ ] Uttar Pradesh expansion
  - [ ] West Bengal integration
  - [ ] Maharashtra market entry
  - [ ] State-specific compliance handling

### 🏢 **B2B Marketplace**
- [ ] **Enterprise Features**
  - [ ] Restaurant/hotel procurement system
  - [ ] Wholesale marketplace
  - [ ] Government procurement integration
  - [ ] Export management system

### 🔧 **Technical Scaling**
- [ ] **Infrastructure Optimization**
  - [ ] Microservices architecture migration
  - [ ] Redis caching implementation
  - [ ] CDN setup for global content delivery
  - [ ] Database optimization and sharding

- [ ] **DevOps & Monitoring**
  - [ ] CI/CD pipeline setup
  - [ ] Application monitoring (New Relic/DataDog)
  - [ ] Error tracking and logging
  - [ ] Performance optimization

---

## 🛡️ **Security & Compliance**

### 🔐 **Security Measures**
- [ ] **Data Protection**
  - [ ] GDPR compliance implementation
  - [ ] Data encryption at rest and transit
  - [ ] API rate limiting and security
  - [ ] Regular security audits

- [ ] **Financial Security**
  - [ ] PCI DSS compliance for payments
  - [ ] Fraud detection system
  - [ ] Secure transaction processing
  - [ ] Financial audit trail

### 📋 **Regulatory Compliance**
- [ ] **Legal & Regulatory**
  - [ ] FSSAI compliance for food products
  - [ ] State agriculture department approvals
  - [ ] Labor law compliance
  - [ ] Environmental compliance tracking

---

## 📊 **Technical Integration Checklist**

### 🔌 **Essential APIs to Integrate**
```bash
# Payment Gateways
- Razorpay/Stripe API
- UPI payment integration
- Bank transfer APIs

# Government Data Sources
- Mandi price APIs (state agriculture departments)
- e-NAM integration
- Weather department APIs

# Logistics & Delivery
- Delhivery API
- India Post API
- Local courier APIs
- Google Maps API

# Communication
- Twilio SMS API
- WhatsApp Business API
- SendGrid email API
- Firebase Cloud Messaging

# File Storage & Media
- AWS S3/Cloudinary
- Image compression APIs
- Video streaming services

# Analytics & Monitoring
- Google Analytics
- Mixpanel/Amplitude
- Sentry error tracking
- Application monitoring tools
```

### 🛠️ **Development Tools & Services**
```bash
# Development & Deployment
- GitHub Actions for CI/CD
- Docker for containerization
- Kubernetes for orchestration
- Terraform for infrastructure

# Database & Caching
- MongoDB Atlas (production)
- Redis for caching
- Elasticsearch for search

# Monitoring & Analytics
- Prometheus for metrics
- Grafana for dashboards
- ELK stack for logging
```

---

## 🎯 **Success Metrics & KPIs**

### 📈 **Business Metrics**
- Number of registered farmers
- Products listed on platform
- Monthly transaction volume
- Average order value
- Customer retention rate
- Farmer income improvement

### ⚡ **Technical Metrics**
- Application uptime (99.9% target)
- Page load speed (<3 seconds)
- API response time (<500ms)
- Mobile app performance
- Error rate (<0.1%)

---

## 💡 **Getting Started with Development**

1. **Set up development environment**
   ```bash
   # Install dependencies
   npm run install-all
   
   # Set up environment variables
   cp backend/.env.example backend/.env
   
   # Start development servers
   npm run dev
   ```

2. **Choose your development focus**
   - Backend API development
   - Frontend UI/UX improvements
   - Mobile app development
   - DevOps and deployment
   - Integration development

3. **Pick a milestone from Phase 1 and start building!**

---

## 📝 License

This project is licensed under the MIT License. 