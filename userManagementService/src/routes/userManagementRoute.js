const express = require('express');
const { register, changePassw } = require('../controllers/userManagementController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Expose authentication routes
router.post('/createUser', authMiddleware, register);
router.put('/changePassword', authMiddleware, changePassw);

module.exports = router;