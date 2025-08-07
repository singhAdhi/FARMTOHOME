import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  console.log('Auth middleware called');
  // Get token from header
  const token = req.header('x-auth-token');
  console.log('req:', req);

  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: 'No token, authorization denied'
      }
    });
  }

  // Check if JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured in environment variables');
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_MISCONFIGURATION',
        message: 'Server configuration error'
      }
    });
  }

  // Verify token
  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({ 
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Token is not valid'
          }
        });
      } else {
        req.user = decoded.user;
        console.log('Auth middleware - decoded user:', decoded.user);
        next();
      }
    });
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ 
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server Error in authentication'
      }
    });
  }
}; 