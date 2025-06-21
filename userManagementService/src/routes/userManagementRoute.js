const express = require('express');
const { register, changePassw } = require('../controllers/userManagementController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Expose authentication routes
router.post('/createUser', authMiddleware, register);
router.put('/changePassword', authMiddleware, changePassw);
router.get('/usersByInstitution', authMiddleware, require('../controllers/userManagementController').getUsersForInstitution);

module.exports = router;