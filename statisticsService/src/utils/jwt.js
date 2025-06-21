const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET

// Verify token
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey, { algorithms: ['HS256'] });
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = {verifyToken};