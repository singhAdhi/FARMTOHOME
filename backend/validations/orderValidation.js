import { z } from 'zod';

// Order status enum
const ORDER_STATUSES = [
  'pending', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled', 'rejected'
];

// Payment methods enum
const PAYMENT_METHODS = ['card', 'upi', 'wallet', 'cod'];

// Delivery address schema (reusable)
const deliveryAddressSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'),
  
  street: z
    .string()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address must be less than 200 characters')
    .trim(),
  
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .trim(),
  
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .trim(),
  
  pincode: z
    .string()
    .regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  
  coordinates: z
    .array(z.number())
    .length(2, 'Coordinates must be [longitude, latitude]')
    .optional(),
  
  landmark: z
    .string()
    .max(100, 'Landmark must be less than 100 characters')
    .optional()
});

// Place order validation
const placeOrderSchema = z.object({
  body: z.object({
    deliveryAddress: deliveryAddressSchema,
    
    paymentMethod: z
      .enum(PAYMENT_METHODS, {
        errorMap: () => ({ message: `Payment method must be one of: ${PAYMENT_METHODS.join(', ')}` })
      })
      .default('cod'),
    
    instructions: z
      .string()
      .max(500, 'Instructions must be less than 500 characters')
      .optional(),
    
    expectedDeliveryDate: z
      .string()
      .datetime('Invalid expected delivery date format')
      .optional(),
    
    // For specific payment methods
    paymentDetails: z.object({
      cardToken: z.string().optional(), // For card payments
      upiId: z.string().email('Invalid UPI ID format').optional(), // For UPI payments
      walletId: z.string().optional() // For wallet payments
    }).optional()
  })
});

// Update order status validation (for farmers and admin)
const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z
      .enum(ORDER_STATUSES, {
        errorMap: () => ({ message: `Status must be one of: ${ORDER_STATUSES.join(', ')}` })
      }),
    
    note: z
      .string()
      .max(500, 'Note must be less than 500 characters')
      .optional(),
    
    trackingId: z
      .string()
      .max(50, 'Tracking ID must be less than 50 characters')
      .optional(),
    
    deliveryPartner: z
      .string()
      .max(50, 'Delivery partner name must be less than 50 characters')
      .optional(),
    
    expectedDeliveryDate: z
      .string()
      .datetime('Invalid expected delivery date format')
      .optional()
  }),
  
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID format')
  })
});

// Cancel order validation
const cancelOrderSchema = z.object({
  body: z.object({
    reason: z
      .string()
      .min(5, 'Cancellation reason must be at least 5 characters')
      .max(500, 'Cancellation reason must be less than 500 characters')
      .trim()
  }),
  
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID format')
  })
});

// Get orders query validation
const getOrdersQuerySchema = z.object({
  query: z.object({
    status: z
      .enum(ORDER_STATUSES)
      .optional(),
    
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a positive integer')
      .transform(val => parseInt(val))
      .optional()
      .default(1),
    
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a positive integer')
      .transform(val => parseInt(val))
      .refine(val => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
      .optional()
      .default(20),
    
    fromDate: z
      .string()
      .datetime('Invalid from date format')
      .optional(),
    
    toDate: z
      .string()
      .datetime('Invalid to date format')
      .optional(),
    
    minAmount: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Invalid minimum amount format')
      .transform(val => parseFloat(val))
      .optional(),
    
    maxAmount: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Invalid maximum amount format')
      .transform(val => parseFloat(val))
      .optional()
  }).refine(
    (data) => {
      // Ensure from date is before to date
      if (data.fromDate && data.toDate) {
        return new Date(data.fromDate) <= new Date(data.toDate);
      }
      return true;
    },
    {
      message: "From date must be before to date",
      path: ["fromDate"]
    }
  ).refine(
    (data) => {
      // Ensure min amount is less than max amount
      if (data.minAmount && data.maxAmount) {
        return data.minAmount <= data.maxAmount;
      }
      return true;
    },
    {
      message: "Minimum amount must be less than or equal to maximum amount",
      path: ["minAmount"]
    }
  )
});

// Get single order validation
const getOrderByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID format')
  })
});

// Return order validation
const returnOrderSchema = z.object({
  body: z.object({
    reason: z
      .string()
      .min(5, 'Return reason must be at least 5 characters')
      .max(500, 'Return reason must be less than 500 characters')
      .trim(),
    
    items: z
      .array(z.object({
        productId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
        
        quantity: z
          .number()
          .int('Quantity must be an integer')
          .min(1, 'Quantity must be at least 1'),
        
        reason: z
          .string()
          .min(5, 'Item return reason must be at least 5 characters')
          .max(200, 'Item return reason must be less than 200 characters')
      }))
      .min(1, 'At least one item must be selected for return')
      .optional(), // If not provided, entire order is returned
    
    refundMethod: z
      .enum(['original', 'wallet', 'bank'])
      .default('original'),
    
    bankDetails: z.object({
      accountNumber: z.string().regex(/^\d{9,18}$/, 'Invalid account number'),
      ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
      accountHolderName: z.string().min(2, 'Account holder name is required')
    }).optional() // Required only if refundMethod is 'bank'
  }),
  
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID format')
  })
}).refine(
  (data) => {
    // If refund method is bank, bank details are required
    if (data.body.refundMethod === 'bank' && !data.body.bankDetails) {
      return false;
    }
    return true;
  },
  {
    message: "Bank details are required when refund method is 'bank'",
    path: ["body", "bankDetails"]
  }
);

export default {
  placeOrderSchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
  getOrdersQuerySchema,
  getOrderByIdSchema,
  returnOrderSchema,
  deliveryAddressSchema,
  ORDER_STATUSES,
  PAYMENT_METHODS
}; 