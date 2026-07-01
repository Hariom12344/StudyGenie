-- Seed Data for ExamAce Database

USE examace_db;

-- 1. Insert Exams
INSERT INTO exams (id, name, category, description) VALUES
(1, 'JEE Main', 'Engineering Entrance', 'Joint Entrance Examination for engineering colleges in India'),
(2, 'JEE Advanced', 'Engineering Entrance', 'Entrance exam for IITs'),
(3, 'NEET UG', 'Medical Entrance', 'National Eligibility cum Entrance Test for medical undergraduate programs'),
(4, 'Class 12 Boards', 'School', 'High school exit certification exam'),
(5, 'UPSC Civil Services', 'Government Exams', 'Civil service selection process for Indian administration services'),
(6, 'SSC CGL', 'Government Exams', 'Staff Selection Commission Combined Graduate Level exam'),
(7, 'Placement Aptitude', 'Placement Preparation', 'Aptitude and coding rounds for campus recruitment');

-- 2. Insert Subjects
INSERT INTO subjects (id, exam_id, name, description) VALUES
(1, 1, 'Physics', 'Core Physics concepts for engineering entrance'),
(2, 1, 'Chemistry', 'Organic, Inorganic, and Physical Chemistry'),
(3, 1, 'Mathematics', 'Calculus, Algebra, Coordinate Geometry, Trigonometry'),
(4, 3, 'Biology', 'Botany and Zoology concepts for medical entrance'),
(5, 7, 'Quantitative Aptitude', 'Mathematical aptitude and problem solving'),
(6, 7, 'Coding', 'Algorithms, Data Structures, and Programming logic');

-- 3. Insert Chapters
INSERT INTO chapters (id, subject_id, name) VALUES
(1, 1, 'Electrostatics'),
(2, 1, 'Kinematics'),
(3, 2, 'Chemical Bonding'),
(4, 3, 'Limits & Continuity'),
(5, 4, 'Cell Division'),
(6, 5, 'Time and Work'),
(7, 6, 'Arrays & Linked Lists');

-- 4. Insert Topics
INSERT INTO topics (id, chapter_id, name) VALUES
(1, 1, 'Coulombs Law'),
(2, 1, 'Electric Field Intensity'),
(3, 2, 'Projectile Motion'),
(4, 3, 'VSEPR Theory'),
(5, 4, 'Evaluation of Limits'),
(6, 5, 'Mitosis and Meiosis'),
(7, 6, 'Work & Wages Problems'),
(8, 7, 'Reverse a Linked List');

-- 5. Insert Questions
INSERT INTO questions (id, topic_id, question_text, type, difficulty, option_a, option_b, option_c, option_d, correct_answer, solution, created_by) VALUES
(1, 1, 'Two charges of 1 C each are placed 1 meter apart in a vacuum. What is the electrostatic force between them?', 'MCQ', 'Easy', '9 * 10^9 N', '1 N', '9 * 10^-9 N', '8.85 * 10^-12 N', 'A', 'Using Coulombs Law: F = k * (q1 * q2) / r^2 where k = 9 * 10^9 N m^2/C^2. F = 9*10^9 * (1*1)/1^2 = 9 * 10^9 N.', NULL),
(2, 3, 'A ball is projected horizontally with velocity v from a height h. What is the time taken to reach the ground?', 'MCQ', 'Medium', 'sqrt(h/g)', 'sqrt(2h/g)', '2h/g', 'h/g', 'B', 'Vertically, using s = ut + 0.5gt^2: h = 0 + 0.5 * g * t^2 => t = sqrt(2h/g).', NULL),
(3, 4, 'According to VSEPR theory, what is the shape of a water molecule (H2O)?', 'MCQ', 'Medium', 'Linear', 'Trigonal Planar', 'Bent / V-shaped', 'Tetrahedral', 'C', 'H2O has 2 bond pairs and 2 lone pairs on oxygen, leading to a bent or V-shape due to lone pair-lone pair repulsion.', NULL),
(4, 5, 'Evaluate the limit: lim (x -> 0) of (sin(x)/x).', 'Numerical', 'Easy', NULL, NULL, NULL, NULL, '1', 'Standard trigonometric limit formula: lim (x -> 0) sin(x)/x = 1.', NULL),
(5, 8, 'Write a function to reverse a singly linked list in C/Java/Python. Your code must return the new head.', 'Coding', 'Hard', NULL, NULL, NULL, NULL, 'Node reverse(Node head) { Node prev = null; Node current = head; Node next = null; while(current != null){ next = current.next; current.next = prev; prev = current; current = next; } return prev; }', 'Iterate through the list, keep track of previous and next nodes, change pointers current.next to prev, then advance.', NULL),
(6, 6, 'A can do a work in 10 days and B in 15 days. How many days will they take to complete the work together?', 'Numerical', 'Easy', NULL, NULL, NULL, NULL, '6', '1/A + 1/B = 1/10 + 1/15 = 5/30 = 1/6. So they will take 6 days.', NULL);

-- 6. Insert Mock Tests
INSERT INTO mock_tests (id, exam_id, title, type, duration_minutes, total_marks, negative_marking) VALUES
(1, 1, 'JEE Main Physics Practice Quiz', 'Topic Test', 30, 40, -1.0),
(2, 1, 'JEE Main Grand Mock Test - 1', 'Full-Length', 180, 300, -1.0),
(3, 7, 'Placement Aptitude and Coding Assessment', 'Weekly Quiz', 60, 100, 0.0);

-- Map questions to Mock Tests
INSERT INTO test_questions (test_id, question_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6);

-- 7. Previous Year Papers
INSERT INTO previous_year_papers (id, exam_id, title, year, file_url) VALUES
(1, 1, 'JEE Main Physics Paper Shift 1', 2024, '/downloads/jee_main_physics_2024.pdf'),
(2, 1, 'JEE Main Mathematics Paper Shift 2', 2023, '/downloads/jee_main_maths_2023.pdf'),
(3, 3, 'NEET UG Biology & Chemistry Combined', 2024, '/downloads/neet_ug_2024.pdf'),
(4, 5, 'UPSC Civil Services GS Paper I', 2023, '/downloads/upsc_gs_1_2023.pdf');

-- 8. Study Material
INSERT INTO study_materials (id, subject_id, title, type, file_url) VALUES
(1, 1, 'Electrostatics Quick Formula Cheat Sheet', 'Formula Sheet', '/downloads/electrostatics_formulas.pdf'),
(2, 3, 'Limits & Continuity Concepts and Mind Map', 'Mind Map', '/downloads/limits_mindmap.pdf'),
(3, 2, 'Chemical Bonding Short Notes', 'Notes', '/downloads/chemical_bonding_notes.pdf');
