const getCourses = require('../controllers/coursesController.js');
const { authMiddleware } = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();

// Define the route to get courses for a specific student
router.get('/myCourses', authMiddleware, getCourses);

// Export the router
module.exports = router;