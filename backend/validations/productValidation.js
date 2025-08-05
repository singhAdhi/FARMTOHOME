import { z } from 'zod';

// Product categories (you can expand this list)
const PRODUCT_CATEGORIES = [
  'vegetables', 'fruits', 'grains', 'pulses', 'spices', 'herbs', 
  'dairy', 'honey', 'nuts', 'seeds', 'flowers', 'medicinal-plants'
];

// Product units
const PRODUCT_UNITS = [
  'kg', 'gram', 'quintal', 'ton', 'piece', 'dozen', 'liter', 'ml'
];

// Create product validation
const createProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Product name must be at least 2 characters')
      .max(100, 'Product name must be less than 100 characters')
      .trim(),
    
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must be less than 1000 characters')
      .trim(),
    
    price: z
      .number()
      .positive('Price must be greater than 0')
      .max(100000, 'Price cannot exceed ₹1,00,000'),
    
    category: z
      .enum(PRODUCT_CATEGORIES, {
        errorMap: () => ({ message: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}` })
      }),
    
    unit: z
      .enum(PRODUCT_UNITS, {
        errorMap: () => ({ message: `Unit must be one of: ${PRODUCT_UNITS.join(', ')}` })
      }),
    
    stock: z
      .number()
      .min(0, 'Stock cannot be negative')
      .max(100000, 'Stock cannot exceed 1,00,000 units'),
    
    images: z
      .array(z.string().url('Each image must be a valid URL'))
      .min(1, 'At least one image is required')
      .max(5, 'Maximum 5 images allowed')
      .optional()
      .default([]),
    
    isOrganic: z
      .boolean()
      .optional()
      .default(false),
    
    tags: z
      .array(z.string().min(2, 'Each tag must be at least 2 characters'))
      .max(10, 'Maximum 10 tags allowed')
      .optional()
      .default([]),
    
    // Harvest and quality details
    harvestDate: z
      .string()
      .datetime('Invalid harvest date format')
      .optional(),
    
    expiryDate: z
      .string()
      .datetime('Invalid expiry date format')
      .optional(),
    
    qualityGrade: z
      .enum(['A', 'B', 'C'], {
        errorMap: () => ({ message: 'Quality grade must be A, B, or C' })
      })
      .optional(),
    
    // Location and delivery
    availableLocations: z
      .array(z.string().min(2, 'Location must be at least 2 characters'))
      .min(1, 'At least one location is required')
      .optional(),
    
    deliveryRadius: z
      .number()
      .min(1, 'Delivery radius must be at least 1 km')
      .max(500, 'Delivery radius cannot exceed 500 km')
      .optional(),
    
    // Pricing details
    minimumOrderQuantity: z
      .number()
      .min(1, 'Minimum order quantity must be at least 1')
      .optional()
      .default(1),
    
    discountPercentage: z
      .number()
      .min(0, 'Discount cannot be negative')
      .max(90, 'Discount cannot exceed 90%')
      .optional()
      .default(0),
    
    // Special instructions
    specialInstructions: z
      .string()
      .max(500, 'Special instructions must be less than 500 characters')
      .optional(),
    
    // Seasonal availability
    seasonalAvailability: z
      .array(z.enum(['spring', 'summer', 'monsoon', 'autumn', 'winter']))
      .optional()
  }).refine(
    (data) => {
      // If expiry date is provided, it should be after harvest date
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

// Update product validation
const updateProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Product name must be at least 2 characters')
      .max(100, 'Product name must be less than 100 characters')
      .trim()
      .optional(),
    
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must be less than 1000 characters')
      .trim()
      .optional(),
    
    price: z
      .number()
      .positive('Price must be greater than 0')
      .max(100000, 'Price cannot exceed ₹1,00,000')
      .optional(),
    
    category: z
      .enum(PRODUCT_CATEGORIES, {
        errorMap: () => ({ message: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}` })
      })
      .optional(),
    
    unit: z
      .enum(PRODUCT_UNITS, {
        errorMap: () => ({ message: `Unit must be one of: ${PRODUCT_UNITS.join(', ')}` })
      })
      .optional(),
    
    stock: z
      .number()
      .min(0, 'Stock cannot be negative')
      .max(100000, 'Stock cannot exceed 1,00,000 units')
      .optional(),
    
    images: z
      .array(z.string().url('Each image must be a valid URL'))
      .min(1, 'At least one image is required')
      .max(5, 'Maximum 5 images allowed')
      .optional(),
    
    isOrganic: z
      .boolean()
      .optional(),
    
    tags: z
      .array(z.string().min(2, 'Each tag must be at least 2 characters'))
      .max(10, 'Maximum 10 tags allowed')
      .optional(),
    
    isAvailable: z
      .boolean()
      .optional(),
    
    harvestDate: z
      .string()
      .datetime('Invalid harvest date format')
      .optional(),
    
    expiryDate: z
      .string()
      .datetime('Invalid expiry date format')
      .optional(),
    
    qualityGrade: z
      .enum(['A', 'B', 'C'], {
        errorMap: () => ({ message: 'Quality grade must be A, B, or C' })
      })
      .optional(),
    
    availableLocations: z
      .array(z.string().min(2, 'Location must be at least 2 characters'))
      .optional(),
    
    deliveryRadius: z
      .number()
      .min(1, 'Delivery radius must be at least 1 km')
      .max(500, 'Delivery radius cannot exceed 500 km')
      .optional(),
    
    minimumOrderQuantity: z
      .number()
      .min(1, 'Minimum order quantity must be at least 1')
      .optional(),
    
    discountPercentage: z
      .number()
      .min(0, 'Discount cannot be negative')
      .max(90, 'Discount cannot exceed 90%')
      .optional(),
    
    specialInstructions: z
      .string()
      .max(500, 'Special instructions must be less than 500 characters')
      .optional(),
    
    seasonalAvailability: z
      .array(z.enum(['spring', 'summer', 'monsoon', 'autumn', 'winter']))
      .optional()
  }),
  
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format')
  })
});

// Get products query validation
const getProductsQuerySchema = z.object({
  query: z.object({
    category: z
      .enum(PRODUCT_CATEGORIES)
      .optional(),
    
    location: z
      .string()
      .min(2, 'Location must be at least 2 characters')
      .optional(),
    
    price_min: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Invalid minimum price format')
      .transform(val => parseFloat(val))
      .optional(),
    
    price_max: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Invalid maximum price format')
      .transform(val => parseFloat(val))
      .optional(),
    
    search: z
      .string()
      .min(2, 'Search term must be at least 2 characters')
      .max(50, 'Search term must be less than 50 characters')
      .optional(),
    
    sort_by: z
      .enum(['price', 'createdAt', 'name', 'rating', 'distance'])
      .optional()
      .default('createdAt'),
    
    order: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc'),
    
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
    
    isOrganic: z
      .enum(['true', 'false'])
      .transform(val => val === 'true')
      .optional(),
    
    inStock: z
      .enum(['true', 'false'])
      .transform(val => val === 'true')
      .optional()
  }).refine(
    (data) => {
      // Ensure min price is less than max price
      if (data.price_min && data.price_max) {
        return data.price_min <= data.price_max;
      }
      return true;
    },
    {
      message: "Minimum price must be less than or equal to maximum price",
      path: ["price_min"]
    }
  )
});

// Get single product validation
const getProductByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format')
  })
});

// Search products validation
const searchProductsSchema = z.object({
  query: z.object({
    q: z
      .string()
      .min(2, 'Search query must be at least 2 characters')
      .max(50, 'Search query must be less than 50 characters'),
    
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a positive integer')
      .transform(val => parseInt(val))
      .refine(val => val >= 1 && val <= 50, 'Limit must be between 1 and 50')
      .optional()
      .default(10)
  })
});

export {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
  getProductByIdSchema,
  searchProductsSchema,
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS
}; 