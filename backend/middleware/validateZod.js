import { ZodError } from 'zod';

/**
 * Middleware to validate request using Zod schema
 * @param {Object} schema - Zod schema object with body, params, query properties
 * @returns {Function} Express middleware function
 */
const validateZod = (schema) => {
  return async (req, res, next) => {
    try {
      // Create object to validate based on what the schema expects
      const toValidate = {};
      
      // Add body if schema has body validation
      if (schema.shape && schema.shape.body) {
        toValidate.body = req.body;
      }
      
      // Add params if schema has params validation
      if (schema.shape && schema.shape.params) {
        toValidate.params = req.params;
      }
      
      // Add query if schema has query validation
      if (schema.shape && schema.shape.query) {
        toValidate.query = req.query;
      }
      
      // If schema doesn't have shape (it's a direct schema), validate the body
      if (!schema.shape) {
        toValidate.body = req.body;
      }
      
      // Parse and validate the request
      const validatedData = await schema.parseAsync(toValidate);
      
      // Replace request data with validated (and potentially transformed) data
      if (validatedData.body) {
        req.body = validatedData.body;
      }
      if (validatedData.params) {
        req.params = validatedData.params;
      }
      if (validatedData.query) {
        req.query = validatedData.query;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors for consistent API response
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.input
        }));
        
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: formattedErrors
          }
        });
      }
      
      // Handle other errors
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Validation error occurred'
        }
      });
    }
  };
};

/**
 * Middleware to validate only request body
 * @param {Object} bodySchema - Zod schema for body validation
 * @returns {Function} Express middleware function
 */
const validateBody = (bodySchema) => {
  return async (req, res, next) => {
    try {
      const validatedBody = await bodySchema.parseAsync(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.input
        }));
        
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: formattedErrors
          }
        });
      }
      
      console.error('Body validation error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Body validation error occurred'
        }
      });
    }
  };
};

/**
 * Middleware to validate only request params
 * @param {Object} paramsSchema - Zod schema for params validation
 * @returns {Function} Express middleware function
 */
const validateParams = (paramsSchema) => {
  return async (req, res, next) => {
    try {
      const validatedParams = await paramsSchema.parseAsync(req.params);
      req.params = validatedParams;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.input
        }));
        
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request parameters',
            details: formattedErrors
          }
        });
      }
      
      console.error('Params validation error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Params validation error occurred'
        }
      });
    }
  };
};

/**
 * Middleware to validate only query parameters
 * @param {Object} querySchema - Zod schema for query validation
 * @returns {Function} Express middleware function
 */
const validateQuery = (querySchema) => {
  return async (req, res, next) => {
    try {
      const validatedQuery = await querySchema.parseAsync(req.query);
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.input
        }));
        
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: formattedErrors
          }
        });
      }
      
      console.error('Query validation error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Query validation error occurred'
        }
      });
    }
  };
};

/**
 * Middleware to validate file uploads
 * @param {Object} options - File validation options
 * @returns {Function} Express middleware function
 */
const validateFile = (options = {}) => {
  const {
    required = false,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    maxSize = 5 * 1024 * 1024, // 5MB
    maxFiles = 5
  } = options;
  
  return (req, res, next) => {
    try {
      const files = req.files || [];
      
      // Check if files are required
      if (required && files.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'File upload is required',
            details: [{ field: 'files', message: 'At least one file is required' }]
          }
        });
      }
      
      // Check number of files
      if (files.length > maxFiles) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Maximum ${maxFiles} files allowed`,
            details: [{ field: 'files', message: `Too many files. Maximum ${maxFiles} allowed.` }]
          }
        });
      }
      
      // Validate each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file type
        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid file type',
              details: [{ 
                field: `files[${i}]`, 
                message: `File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(', ')}`
              }]
            }
          });
        }
        
        // Check file size
        if (file.size > maxSize) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'File too large',
              details: [{ 
                field: `files[${i}]`, 
                message: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${(maxSize / 1024 / 1024).toFixed(2)}MB`
              }]
            }
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('File validation error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'File validation error occurred'
        }
      });
    }
  };
};

export  {
  validateZod,
  validateBody,
  validateParams,
  validateQuery,
  validateFile
}; 