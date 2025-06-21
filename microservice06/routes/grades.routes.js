const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/grades.controller');
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

// Μόνο authenticated χρήστες περνάνε
router.post('/upload-preview', verifyToken, upload.single('file'), gradesController.uploadPreview);
router.post('/upload-confirm', verifyToken, gradesController.uploadConfirm);
router.get('/Grades/:studentId/data', verifyToken, gradesController.getGradesByStudent);
router.get('/Grades/:studentId/:courseName/data', verifyToken, gradesController.getGradeDetails);

module.exports = router;
