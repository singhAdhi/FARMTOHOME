import { z } from 'zod';

// User registration validation
const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .trim(),
    
    email: z
      .string()
      .email('Please provide a valid email address')
      .toLowerCase(),
    
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be less than 100 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    role: z
      .enum(['customer', 'farmer'], {
        errorMap: () => ({ message: 'Role must be either customer or farmer' })
      })
      .default('customer'),
    
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number')
      .optional(),
    
    address: z.object({
      street: z.string().min(5, 'Street address must be at least 5 characters').optional(),
      city: z.string().min(2, 'City must be at least 2 characters').optional(),
      state: z.string().min(2, 'State must be at least 2 characters').optional(),
      pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional(),
      coordinates: z.array(z.number()).length(2).optional() // [longitude, latitude]
    }).optional(),
    
    // Farmer-specific fields
    farmerDetails: z.object({
      farmSize: z.number().positive('Farm size must be positive').optional(),
      farmLocation: z.string().min(5, 'Farm location must be at least 5 characters').optional(),
      cropTypes: z.array(z.string()).min(1, 'At least one crop type is required').optional(),
      experienceYears: z.number().min(0, 'Experience cannot be negative').optional(),
      bankDetails: z.object({
        accountNumber: z.string().regex(/^\d{9,18}$/, 'Invalid account number').optional(),
        ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code').optional(),
        bankName: z.string().min(2, 'Bank name must be at least 2 characters').optional(),
        accountHolderName: z.string().min(2, 'Account holder name must be at least 2 characters').optional()
      }).optional(),
      documents: z.object({
        aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits').optional(),
        panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').optional(),
        kccNumber: z.string().optional() // Kisan Credit Card
      }).optional()
    }).optional()
  })
});

// User login validation
const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Please provide a valid email address')
      .toLowerCase(),
    
    password: z
      .string()
      .min(1, 'Password is required')
  })
});

// Update profile validation
const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .trim()
      .optional(),
    
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number')
      .optional(),
    
    address: z.object({
      street: z.string().min(5, 'Street address must be at least 5 characters').optional(),
      city: z.string().min(2, 'City must be at least 2 characters').optional(),
      state: z.string().min(2, 'State must be at least 2 characters').optional(),
      pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional(),
      coordinates: z.array(z.number()).length(2).optional()
    }).optional(),
    
    farmerDetails: z.object({
      farmSize: z.number().positive('Farm size must be positive').optional(),
      farmLocation: z.string().min(5, 'Farm location must be at least 5 characters').optional(),
      cropTypes: z.array(z.string()).min(1, 'At least one crop type is required').optional(),
      experienceYears: z.number().min(0, 'Experience cannot be negative').optional(),
      bankDetails: z.object({
        accountNumber: z.string().regex(/^\d{9,18}$/, 'Invalid account number').optional(),
        ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code').optional(),
        bankName: z.string().min(2, 'Bank name must be at least 2 characters').optional(),
        accountHolderName: z.string().min(2, 'Account holder name must be at least 2 characters').optional()
      }).optional(),
      documents: z.object({
        aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits').optional(),
        panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').optional(),
        kccNumber: z.string().optional()
      }).optional()
    }).optional()
  })
});

// Change password validation
const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .max(100, 'New password must be less than 100 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
        'New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your new password')
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
});

export {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
}; 
