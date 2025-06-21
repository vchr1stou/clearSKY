const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const verifyToken = require('../middlewares/verifyToken');

// GET: All pending reviews for an instructor
router.get('/ReviewsPending/data/:instructorId', verifyToken, requestController.getPendingRequests);

// POST: Submit or update student review request
router.post('/FormRequest/:studentId/:gradeId/feedback', verifyToken, requestController.submitFeedback);

// GET: Specific review request details (instructor view)
router.get('/ReviewsRespond/:requestId/data', verifyToken, requestController.getReviewData);

// POST: Instructor reply to a review request
router.post('/ReviewsRespond/:requestId/reply', verifyToken, requestController.replyToRequest);

// GET: Review status for student (course + exam period)
router.get('/ReviewStatus/:studentId/:courseName/:examPeriod', verifyToken, requestController.getReviewStatus);

module.exports = router;
