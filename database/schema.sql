-- MySQL Database Schema for ExamAce - AI-Powered Exam Preparation Platform

CREATE DATABASE IF NOT EXISTS examace_db;
USE examace_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Teacher', 'Admin') DEFAULT 'Student',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255) NULL,
    reset_token VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    user_id INT PRIMARY KEY,
    phone VARCHAR(15) NULL,
    avatar_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    school_college VARCHAR(150) NULL,
    branch VARCHAR(100) NULL,
    class_name VARCHAR(50) NULL,
    semester VARCHAR(20) NULL,
    preferred_exam VARCHAR(100) NULL,
    target_score INT DEFAULT 90,
    bio TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category ENUM('School', 'Engineering Entrance', 'Medical Entrance', 'Government Exams', 'Placement Preparation', 'College Exams') NOT NULL,
    description TEXT NULL
);

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    UNIQUE KEY uq_exam_subject (exam_id, name)
);

-- 5. Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 6. Topics Table
CREATE TABLE IF NOT EXISTS topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- 7. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT NOT NULL,
    question_text TEXT NOT NULL,
    type ENUM('MCQ', 'Numerical', 'Fill in the Blank', 'Coding', 'Descriptive') DEFAULT 'MCQ',
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    option_a VARCHAR(255) NULL,
    option_b VARCHAR(255) NULL,
    option_c VARCHAR(255) NULL,
    option_d VARCHAR(255) NULL,
    correct_answer TEXT NOT NULL, -- Holds A/B/C/D, numerical values, coding output, etc.
    solution TEXT NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Mock Tests Table
CREATE TABLE IF NOT EXISTS mock_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    type ENUM('Full-Length', 'Chapter Test', 'Topic Test', 'Daily Quiz', 'Weekly Quiz') DEFAULT 'Full-Length',
    duration_minutes INT NOT NULL DEFAULT 180,
    total_marks INT NOT NULL DEFAULT 300,
    negative_marking FLOAT DEFAULT -1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 9. Test Questions Mapping Table
CREATE TABLE IF NOT EXISTS test_questions (
    test_id INT NOT NULL,
    question_id INT NOT NULL,
    PRIMARY KEY (test_id, question_id),
    FOREIGN KEY (test_id) REFERENCES mock_tests(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 10. Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    wrong_answers INT NOT NULL,
    time_spent_seconds INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES mock_tests(id) ON DELETE CASCADE
);

-- 11. Notes & Study Material Table
CREATE TABLE IF NOT EXISTS study_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    type ENUM('Notes', 'Formula Sheet', 'Mind Map', 'Cheat Sheet') NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    download_count INT DEFAULT 0,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 12. Flashcards Table
CREATE TABLE IF NOT EXISTS flashcards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    box INT DEFAULT 1, -- For spaced repetition (Leitner system)
    next_review_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 13. Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_type ENUM('Question', 'Note', 'Paper', 'Video') NOT NULL,
    item_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    link VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 14. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    type ENUM('Test Reminder', 'Goal Alert', 'AI Recommendation', 'Announcement') DEFAULT 'Announcement',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 15. Gamification / Streaks Table
CREATE TABLE IF NOT EXISTS user_stats (
    user_id INT PRIMARY KEY,
    xp INT DEFAULT 0,
    streak INT DEFAULT 0,
    coins INT DEFAULT 0,
    level INT DEFAULT 1,
    last_active DATE NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 16. Leaderboard Table
CREATE TABLE IF NOT EXISTS leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT DEFAULT 0,
    rank_scope ENUM('School', 'College', 'State', 'National') DEFAULT 'National',
    rank_value INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 17. AI History Table
CREATE TABLE IF NOT EXISTS ai_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    query_text TEXT NOT NULL,
    response_text TEXT NOT NULL,
    feature ENUM('Doubt Solver', 'Question Generator', 'Study Planner', 'Test Analyzer') NOT NULL,
    file_attachment_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 18. Previous Year Papers Table
CREATE TABLE IF NOT EXISTS previous_year_papers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    year INT NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    download_count INT DEFAULT 0,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 19. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    milestone_name VARCHAR(100) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
