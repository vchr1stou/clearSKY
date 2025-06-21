const { verifyToken } = require('../utils/jwt');
const User = require('../models/user');

async function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const payload = verifyToken(token);
        const user = await User.findOne({ where: { email: payload.email } });
        
        if (!user || user.role === 'INSTRUCTOR' || user.role === 'STUDENT') {
            return res.status(403).json({ message: 'Access forbidden' });
        }
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { authMiddleware };