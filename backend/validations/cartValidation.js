import { z } from 'zod';

// Add item to cart validation
const addToCartSchema = z.object({
  body: z.object({
    productId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
    
    quantity: z
      .number()
      .int('Quantity must be an integer')
      .min(1, 'Quantity must be at least 1')
      .max(1000, 'Quantity cannot exceed 1000')
  })
});

// Update cart item validation
const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z
      .number()
      .int('Quantity must be an integer')
      .min(1, 'Quantity must be at least 1')
      .max(1000, 'Quantity cannot exceed 1000')
  }),
  
  params: z.object({
    itemId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid cart item ID format')
  })
});

// Remove cart item validation
const removeCartItemSchema = z.object({
  params: z.object({
    itemId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid cart item ID format')
  })
});

export  {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema
}; 