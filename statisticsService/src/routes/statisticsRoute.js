const {getStatistics, getMyStats, createStats} = require('../controllers/statisticsController');
const {authMiddleware} = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/courseStats/:courseId/:institutionId/:examPeriod', authMiddleware, getStatistics);
router.get('/createStats/:institutionId', authMiddleware, createStats);
router.get('/myStats', authMiddleware, getMyStats);

module.exports = router;