const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticateToken } = require('../middleware/auth');

// Public educational directory items
router.get('/exams', examController.getExams);
router.get('/exams/:examId/subjects', examController.getSubjects);
router.get('/subjects/:subjectId/chapters', examController.getChapters);
router.get('/topics/:topicId/questions', examController.getQuestions);
router.get('/pyqs', examController.getPYQs);

// Mock Tests
router.get('/mock-tests', examController.getMockTests);
router.get('/mock-tests/:testId/questions', examController.getMockTestQuestions);
router.post('/mock-tests/submit', authenticateToken, examController.submitMockTest);

// Protected Flashcards
router.get('/flashcards', authenticateToken, examController.getFlashcards);
router.post('/flashcards', authenticateToken, examController.createFlashcard);

// Protected Bookmarks
router.get('/bookmarks', authenticateToken, examController.getBookmarks);
router.post('/bookmarks', authenticateToken, examController.addBookmark);

module.exports = router;
