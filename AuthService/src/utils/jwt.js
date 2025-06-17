const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET

// Sign Token for login and registration
function signToken(payload) {
    return jwt.sign(payload, secretKey,{algorithm: "HS256", expiresIn: '1h' });
}


// Verify token
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey, { algorithms: ['HS256'] });
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = {signToken, verifyToken};