const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const verifyToken = require('../middlewares/verifyToken');

// Get all grades for a specific student
router.get('/Main/:studentId/data', verifyToken, gradeController.getStudentGrades);

// Get specific grade data for the review form
router.get('/FormRequest/:studentId/:gradeId/data', verifyToken, gradeController.getGradeDetails);

module.exports = router;
