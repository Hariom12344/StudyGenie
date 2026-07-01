const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

router.post('/doubt-solve', authenticateToken, aiController.solveDoubt);
router.post('/generate-questions', authenticateToken, aiController.generateQuestions);
router.post('/study-plan', authenticateToken, aiController.generateStudyPlan);

module.exports = router;
