const db = require('../config/db');

// Get all exams grouped by category
async function getExams(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM exams');
    return res.json({ success: true, exams: rows });
  } catch (error) {
    console.error('Fetch exams error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching exams' });
  }
}

// Get subjects for an exam
async function getSubjects(req, res) {
  const { examId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM subjects WHERE exam_id = ?', [examId]);
    return res.json({ success: true, subjects: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get chapters for a subject
async function getChapters(req, res) {
  const { subjectId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM chapters WHERE subject_id = ?', [subjectId]);
    return res.json({ success: true, chapters: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get questions for a topic
async function getQuestions(req, res) {
  const { topicId } = req.params;
  const { difficulty } = req.query;
  try {
    let sql = 'SELECT * FROM questions WHERE topic_id = ?';
    const params = [topicId];
    if (difficulty) {
      sql += ' AND difficulty = ?';
      params.push(difficulty);
    }
    const [rows] = await db.query(sql, params);
    return res.json({ success: true, questions: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get Mock Tests
async function getMockTests(req, res) {
  const { examId } = req.query;
  try {
    let sql = 'SELECT m.*, e.name as exam_name FROM mock_tests m JOIN exams e ON m.exam_id = e.id';
    const params = [];
    if (examId) {
      sql += ' WHERE m.exam_id = ?';
      params.push(examId);
    }
    const [rows] = await db.query(sql, params);
    return res.json({ success: true, mockTests: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get Mock Test Questions
async function getMockTestQuestions(req, res) {
  const { testId } = req.params;
  try {
    const [questions] = await db.query(
      `SELECT q.* FROM questions q 
       JOIN test_questions tq ON q.id = tq.question_id 
       WHERE tq.test_id = ?`,
      [testId]
    );
    const [testDetails] = await db.query('SELECT * FROM mock_tests WHERE id = ?', [testId]);
    
    if (testDetails.length === 0) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }

    return res.json({
      success: true,
      test: testDetails[0],
      questions
    });
  } catch (error) {
    console.error('Fetch test questions error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching test questions' });
  }
}

// Submit Mock Test Results and apply Gamification logic
async function submitMockTest(req, res) {
  const userId = req.user.id;
  const { testId, score, totalQuestions, correctAnswers, wrongAnswers, timeSpentSeconds } = req.body;

  try {
    // 1. Insert results
    await db.query(
      `INSERT INTO test_results (user_id, test_id, score, total_questions, correct_answers, wrong_answers, time_spent_seconds) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, testId, score, totalQuestions, correctAnswers, wrongAnswers, timeSpentSeconds]
    );

    // 2. Gamification: Calculate rewards
    // Each correct answer gives 10 XP + 2 Coins. Completing a test gives 50 XP + 10 Coins.
    const xpReward = (correctAnswers * 10) + 50;
    const coinsReward = (correctAnswers * 2) + 10;

    // Fetch user stats
    const [stats] = await db.query('SELECT * FROM user_stats WHERE user_id = ?', [userId]);
    
    let currentXp = xpReward;
    let currentCoins = coinsReward;
    let currentLevel = 1;
    let currentStreak = 1;

    if (stats.length > 0) {
      currentXp += stats[0].xp;
      currentCoins += stats[0].coins;
      currentStreak = stats[0].streak;
      
      // Streak calculation (increment if active today or consecutive, mock check)
      const lastActive = stats[0].last_active;
      const today = new Date().toISOString().split('T')[0];
      if (lastActive !== today) {
        currentStreak += 1;
      }
      
      // Level progression: 500 XP per level
      currentLevel = Math.floor(currentXp / 500) + 1;

      // Update DB
      await db.query(
        `UPDATE user_stats SET xp = ?, coins = ?, level = ?, streak = ?, last_active = CURDATE() WHERE user_id = ?`,
        [currentXp, currentCoins, currentLevel, currentStreak, userId]
      );
    } else {
      // Insert if missing
      await db.query(
        `INSERT INTO user_stats (user_id, xp, streak, coins, level, last_active) VALUES (?, ?, ?, ?, ?, CURDATE())`,
        [userId, currentXp, currentStreak, currentCoins, currentLevel]
      );
    }

    // 3. Update leaderboard standing
    const [leaderboardEntry] = await db.query('SELECT id FROM leaderboard WHERE user_id = ?', [userId]);
    if (leaderboardEntry.length > 0) {
      await db.query('UPDATE leaderboard SET score = score + ? WHERE user_id = ?', [score, userId]);
    } else {
      await db.query('INSERT INTO leaderboard (user_id, score, rank_scope, rank_value) VALUES (?, ?, "National", 124)', [userId, score]);
    }

    // 4. Create milestone certificate if score >= 80% of total
    let certificateIssued = false;
    const percent = (score / (totalQuestions * 4)) * 100; // Assuming 4 marks per question
    if (percent >= 80) {
      certificateIssued = true;
      await db.query(
        'INSERT INTO certificates (user_id, title, milestone_name, file_url) VALUES (?, ?, ?, ?)',
        [userId, 'Certificate of Excellence', 'Scored 80%+ on Mock Assessment', '/downloads/certificate_milestone.pdf']
      );
    }

    return res.json({
      success: true,
      message: 'Mock test submitted successfully!',
      rewards: {
        xp: xpReward,
        coins: coinsReward,
        levelUp: stats.length > 0 ? (currentLevel > stats[0].level) : false,
        newLevel: currentLevel,
        streak: currentStreak,
        certificate: certificateIssued
      }
    });
  } catch (error) {
    console.error('Submit mock test error:', error);
    return res.status(500).json({ success: false, message: 'Server error submitting test results' });
  }
}

// Flashcards Management
async function getFlashcards(req, res) {
  const userId = req.user.id;
  try {
    const [rows] = await db.query('SELECT * FROM flashcards WHERE user_id = ? ORDER BY next_review_at ASC', [userId]);
    return res.json({ success: true, flashcards: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function createFlashcard(req, res) {
  const userId = req.user.id;
  const { subject, front, back } = req.body;
  try {
    await db.query('INSERT INTO flashcards (user_id, subject, front, back) VALUES (?, ?, ?, ?)', [userId, subject, front, back]);
    return res.status(201).json({ success: true, message: 'Flashcard created!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Previous Year Papers
async function getPYQs(req, res) {
  const { examId } = req.query;
  try {
    let sql = 'SELECT p.*, e.name as exam_name FROM previous_year_papers p JOIN exams e ON p.exam_id = e.id';
    const params = [];
    if (examId) {
      sql += ' WHERE p.exam_id = ?';
      params.push(examId);
    }
    const [rows] = await db.query(sql, params);
    return res.json({ success: true, papers: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching PYQs' });
  }
}

// Bookmarks management
async function getBookmarks(req, res) {
  const userId = req.user.id;
  try {
    const [rows] = await db.query('SELECT * FROM bookmarks WHERE user_id = ?', [userId]);
    return res.json({ success: true, bookmarks: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function addBookmark(req, res) {
  const userId = req.user.id;
  const { itemType, itemId, title, link } = req.body;
  try {
    await db.query(
      'INSERT INTO bookmarks (user_id, item_type, item_id, title, link) VALUES (?, ?, ?, ?, ?)',
      [userId, itemType, itemId, title, link]
    );
    return res.status(201).json({ success: true, message: 'Item bookmarked!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = {
  getExams,
  getSubjects,
  getChapters,
  getQuestions,
  getMockTests,
  getMockTestQuestions,
  submitMockTest,
  getFlashcards,
  createFlashcard,
  getPYQs,
  getBookmarks,
  addBookmark
};
