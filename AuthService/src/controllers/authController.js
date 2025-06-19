const authService = require('../services/authService');

async function register(req, res, next) {
    const { email, password, FullName, role } = req.body;
    if (!email || !password || !FullName || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const token = await authService.registerUser(req.body);
        res.status(201).json({ token });
    } catch (error) {
        error.status = error.status || 400;
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const token = await authService.loginUser(req.body.email, req.body.password);
        res.status(200).json({ token: token, message: 'Login Successful' });
    } catch (error) {
        if (error.status === 401) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        else {
            error.status = error.status || 400;
            next(error);
        }
    }
}

module.exports = { register, login };
