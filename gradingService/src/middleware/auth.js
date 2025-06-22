const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Access token missing',
      message: 'Authorization header with Bearer token is required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        error: 'Invalid or expired token',
        message: 'Please provide a valid token'
      });
    }

    req.user = user; // attach decoded user payload to req.user
    next(); // continue to next middleware or route handler
  });
}

module.exports = { verifyToken }; 