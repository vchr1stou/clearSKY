const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']; // get Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // get token after "Bearer "

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user; // attach decoded user payload to req.user
    next(); // continue to next middleware or route handler
  });
};
