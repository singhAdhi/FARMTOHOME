import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  // Customer who owns this cart
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One cart per customer
    index: true
  },
  
  // Cart items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
CartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for total items count
CartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for cart total (needs populated products)
CartSchema.virtual('total').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

// Method to find item in cart
CartSchema.methods.findItem = function(productId) {
  return this.items.find(item => item.product.toString() === productId.toString());
};

// Method to add item to cart
CartSchema.methods.addItem = function(productId, quantity, price) {
  const existingItem = this.findItem(productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      price
    });
  }
  
  return this.save();
};

// Method to update item quantity
CartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.findItem(productId);
  
  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter(item => item.product.toString() !== productId.toString());
    } else {
      item.quantity = quantity;
    }
  }
  
  return this.save();
};

// Method to remove item from cart
CartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
  return this.save();
};

// Method to clear cart
CartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

// Method to check if cart is empty
CartSchema.methods.isEmpty = function() {
  return this.items.length === 0;
};

export default mongoose.model('Cart', CartSchema); 