import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api';

// Create Axios Client
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000
});

// Attach Authorization Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('examace_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (err) => Promise.reject(err));

// Flag to track mode
let useMock = true;

// Quick connection health check to auto-configure API mode
async function checkBackendHealth() {
  try {
    const res = await axios.get(`${BACKEND_URL}/health`, { timeout: 1500 });
    if (res.data && res.data.success) {
      useMock = false;
      console.log('ExamAce: Backend API server detected. Operating in Live Database Mode.');
    }
  } catch (error) {
    useMock = true;
    console.warn('ExamAce: Backend API unreachable. Running in Client-Side Simulation Mode.');
  }
}

// Perform initial check
checkBackendHealth();

// ==========================================
// CLIENT-SIDE MOCK ENGINE (FALLBACK DATASETS)
// ==========================================
const mockDb = {
  users: [
    { id: 1, name: 'Siddharth Roy', email: 'sid@examace.com', role: 'Student', token: 'mock_tok_sid', isVerified: true },
    { id: 2, name: 'Dr. Anita Mehta', email: 'anita@examace.com', role: 'Teacher', token: 'mock_tok_anita' },
    { id: 3, name: 'Admin Account', email: 'admin@examace.com', role: 'Admin', token: 'mock_tok_admin' }
  ],
  profiles: {
    1: {
      name: 'Siddharth Roy',
      email: 'sid@examace.com',
      phone: '9876543210',
      school_college: 'IIT Bombay Prep Academy',
      branch: 'Science',
      class_name: 'Class 12',
      semester: 'N/A',
      preferred_exam: 'JEE Main',
      target_score: 98,
      bio: 'Aspiring computer scientist preparing to clear IIT JEE Advanced with top honors.',
      avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Siddharth'
    }
  },
  userStats: {
    1: { xp: 320, streak: 5, coins: 45, level: 1, last_active: new Date().toISOString().split('T')[0] }
  },
  exams: [
    { id: 1, name: 'Class 11', category: 'School', description: 'Class 11 Science & Maths syllabus' },
    { id: 2, name: 'Class 12', category: 'School', description: 'Class 12 Board preparation' },
    { id: 3, name: 'JEE Main', category: 'Engineering Entrance', description: 'Engineering undergraduate admission test' },
    { id: 4, name: 'JEE Advanced', category: 'Engineering Entrance', description: 'Entrance exam for IITs' },
    { id: 5, name: 'NEET UG', category: 'Medical Entrance', description: 'Medical undergraduate admission test' },
    { id: 6, name: 'SSC CGL', category: 'Government Exams', description: 'Staff Selection Commission' },
    { id: 7, name: 'Placement Aptitude', category: 'Placement Preparation', description: 'Campus placements training' }
  ],
  subjects: {
    3: [ // JEE Main
      { id: 1, name: 'Physics', desc: 'Mechanics, Electrodynamics & Optics' },
      { id: 2, name: 'Chemistry', desc: 'Physical, Inorganic & Organic' },
      { id: 3, name: 'Mathematics', desc: 'Calculus, Algebra & Vectors' }
    ],
    5: [ // NEET UG
      { id: 4, name: 'Physics', desc: 'General Physics' },
      { id: 5, name: 'Chemistry', desc: 'Chemical structures' },
      { id: 6, name: 'Biology', desc: 'Botany and Zoology systems' }
    ],
    7: [ // Placement Prep
      { id: 7, name: 'Quantitative Aptitude', desc: 'Math problems' },
      { id: 8, name: 'Logical Reasoning', desc: 'Puzzles and analysis' },
      { id: 9, name: 'Coding', desc: 'Algorithms & Structures' }
    ]
  },
  chapters: {
    1: [ // Physics (JEE)
      { id: 1, name: 'Electrostatics' },
      { id: 2, name: 'Kinematics' }
    ],
    3: [ // Maths (JEE)
      { id: 3, name: 'Limits & Continuity' },
      { id: 4, name: 'Trigonometry' }
    ],
    9: [ // Coding
      { id: 5, name: 'Data Structures' },
      { id: 6, name: 'Dynamic Programming' }
    ]
  },
  topics: {
    1: [{ id: 1, name: 'Coulombs Law' }, { id: 2, name: 'Electric Fields' }],
    3: [{ id: 3, name: 'Evaluation of Limits' }],
    5: [{ id: 4, name: 'Reverse a Linked List' }, { id: 5, name: 'Tree Traversals' }]
  },
  questions: {
    1: [ // Coulombs Law
      {
        id: 1,
        question_text: 'Two charges of 1 C each are placed 1 meter apart in a vacuum. What is the electrostatic force between them?',
        type: 'MCQ',
        difficulty: 'Easy',
        option_a: '9 * 10^9 N',
        option_b: '1 N',
        option_c: '9 * 10^-9 N',
        option_d: '8.85 * 10^-12 N',
        correct_answer: 'A',
        solution: 'By Coulombs Law: F = k * (q1 * q2) / r^2, where k = 9*10^9. F = 9*10^9 * 1*1 / 1 = 9*10^9 N.'
      },
      {
        id: 2,
        question_text: 'How does the force between two static charges alter if the dielectric medium increases?',
        type: 'MCQ',
        difficulty: 'Medium',
        option_a: 'Increases',
        option_b: 'Decreases',
        option_c: 'Remains Unchanged',
        option_d: 'Becomes zero',
        correct_answer: 'B',
        solution: 'F_medium = F_vacuum / K. As the dielectric constant K increases, the electrostatic force decreases.'
      }
    ],
    3: [ // Limits
      {
        id: 3,
        question_text: 'Evaluate the limit: lim (x -> 0) of (sin(x)/x).',
        type: 'Numerical',
        difficulty: 'Easy',
        correct_answer: '1',
        solution: 'Standard limit property in trigonometry: lim (x -> 0) sin(x)/x = 1.'
      }
    ],
    4: [ // Linked List
      {
        id: 4,
        question_text: 'Write a function to reverse a singly linked list in Java/Python. Returns the new head.',
        type: 'Coding',
        difficulty: 'Hard',
        correct_answer: 'Node reverse(Node head) { Node prev = null; Node curr = head; while(curr != null) { Node next = curr.next; curr.next = prev; prev = curr; curr = next; } return prev; }',
        solution: 'Reverses current pointers sequentially by keeping track of the previous item.'
      }
    ]
  },
  mockTests: [
    { id: 1, title: 'JEE Main Physics Mini Mock', exam_name: 'JEE Main', duration_minutes: 15, total_marks: 20, questions: [1, 2] },
    { id: 2, title: 'Full Placement Aptitude & Coding', exam_name: 'Placement Preparation', duration_minutes: 45, total_marks: 50, questions: [3, 4] }
  ],
  pyqs: [
    { id: 1, exam_name: 'JEE Main', title: 'Physics PYQ Shift 1', year: 2024, file_url: '/downloads/jee_phys_2024.pdf' },
    { id: 2, exam_name: 'NEET UG', title: 'Biology Paper Complete', year: 2023, file_url: '/downloads/neet_bio_2023.pdf' },
    { id: 3, exam_name: 'Placement Prep', title: 'Aptitude Questions TCS', year: 2022, file_url: '/downloads/tcs_aptitude.pdf' }
  ],
  studyMaterials: [
    { id: 1, subject: 'Physics', title: 'Electrostatics Formulas Cheat Sheet', type: 'Formula Sheet', file_url: '/downloads/phys_electro.pdf' },
    { id: 2, subject: 'Mathematics', title: 'Limits & Calculus Mind Map', type: 'Mind Map', file_url: '/downloads/math_mindmap.pdf' }
  ],
  flashcards: [
    { id: 1, subject: 'Physics', front: 'What is the speed of light in vacuum?', back: '3 * 10^8 m/s' },
    { id: 2, subject: 'Chemistry', front: 'What is the molecular formula of Benzene?', back: 'C6H6' }
  ],
  bookmarks: [
    { id: 1, item_type: 'Note', title: 'Electrostatics Cheat Sheet', link: '#' }
  ],
  notifications: [
    { id: 1, message: 'Your daily study goal is set! Achieve it to continue your 5-day streak.', type: 'Goal Alert', is_read: false },
    { id: 2, message: 'AI Recommendation: Solve 5 MCQ questions on Electrostatics.', type: 'AI Recommendation', is_read: false }
  ],
  leaderboard: [
    { id: 1, name: 'Aryan Sharma', score: 980, level: 12, rank: 1 },
    { id: 2, name: 'Siddharth Roy', score: 850, level: 8, rank: 2 },
    { id: 3, name: 'Neha Deshmukh', score: 790, level: 7, rank: 3 },
    { id: 4, name: 'Rahul Verma', score: 620, level: 5, rank: 4 }
  ],
  certificates: [
    { id: 1, title: 'Certificate of Competence', milestone_name: 'Completed JEE Main Physics Quiz with 90%+', issued_at: '2026-06-30' }
  ]
};

// Local storage management helpers
function getLocalStats() {
  const stored = localStorage.getItem('examace_user_stats');
  if (stored) return JSON.parse(stored);
  return mockDb.userStats[1];
}

function saveLocalStats(stats) {
  localStorage.setItem('examace_user_stats', JSON.stringify(stats));
}

// API Gateway Controller Methods
export const API = {
  // Check operating mode
  isMock: () => useMock,

  // Module 1: Auth Services
  auth: {
    login: async (email, password) => {
      if (useMock) {
        const found = mockDb.users.find(u => u.email === email);
        if (found) {
          localStorage.setItem('examace_token', found.token);
          localStorage.setItem('examace_user', JSON.stringify(found));
          return { success: true, token: found.token, user: found };
        }
        throw new Error('Invalid email or password.');
      } else {
        const res = await apiClient.post('/auth/login', { email, password });
        localStorage.setItem('examace_token', res.data.token);
        localStorage.setItem('examace_user', JSON.stringify(res.data.user));
        return res.data;
      }
    },

    register: async (name, email, password, role) => {
      if (useMock) {
        const newUser = { id: Date.now(), name, email, role: role || 'Student', token: 'mock_tok_' + Date.now(), isVerified: true };
        mockDb.users.push(newUser);
        mockDb.profiles[newUser.id] = {
          name, email, phone: '', school_college: '', branch: '', class_name: '', semester: '', preferred_exam: '', target_score: 90, bio: '', avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
        };
        return { success: true, message: 'Mock Registration Successful.' };
      } else {
        const res = await apiClient.post('/auth/register', { name, email, password, role });
        return res.data;
      }
    },

    logout: () => {
      localStorage.removeItem('examace_token');
      localStorage.removeItem('examace_user');
      localStorage.removeItem('examace_user_stats');
      return { success: true };
    },

    getProfile: async () => {
      if (useMock) {
        const user = JSON.parse(localStorage.getItem('examace_user'));
        const profile = mockDb.profiles[user?.id] || mockDb.profiles[1];
        return { success: true, profile };
      } else {
        const res = await apiClient.get('/auth/profile');
        return res.data;
      }
    },

    updateProfile: async (profileData) => {
      if (useMock) {
        const user = JSON.parse(localStorage.getItem('examace_user'));
        if (user) {
          mockDb.profiles[user.id] = { ...mockDb.profiles[user.id], ...profileData };
          if (profileData.name) {
            user.name = profileData.name;
            localStorage.setItem('examace_user', JSON.stringify(user));
          }
        }
        return { success: true, message: 'Profile updated locally.' };
      } else {
        const res = await apiClient.put('/auth/profile', profileData);
        return res.data;
      }
    }
  },

  // Modules 4 & 5: Directory & Question Bank
  exams: {
    getExams: async () => {
      if (useMock) return { success: true, exams: mockDb.exams };
      const res = await apiClient.get('/exams/exams');
      return res.data;
    },

    getSubjects: async (examId) => {
      if (useMock) return { success: true, subjects: mockDb.subjects[examId] || [] };
      const res = await apiClient.get(`/exams/exams/${examId}/subjects`);
      return res.data;
    },

    getChapters: async (subjectId) => {
      if (useMock) return { success: true, chapters: mockDb.chapters[subjectId] || [] };
      const res = await apiClient.get(`/exams/subjects/${subjectId}/chapters`);
      return res.data;
    },

    getQuestions: async (topicId, difficulty) => {
      if (useMock) {
        let q = mockDb.questions[topicId] || [];
        if (difficulty) q = q.filter(item => item.difficulty === difficulty);
        return { success: true, questions: q };
      }
      const res = await apiClient.get(`/exams/topics/${topicId}/questions`, { params: { difficulty } });
      return res.data;
    },

    // Module 6: Mock Tests
    getMockTests: async (examId) => {
      if (useMock) {
        return { success: true, mockTests: mockDb.mockTests };
      }
      const res = await apiClient.get('/exams/mock-tests', { params: { examId } });
      return res.data;
    },

    getMockTestQuestions: async (testId) => {
      if (useMock) {
        const test = mockDb.mockTests.find(t => t.id === Number(testId)) || mockDb.mockTests[0];
        const questionsList = test.questions.map(qid => {
          // Find question
          for (let key in mockDb.questions) {
            const found = mockDb.questions[key].find(q => q.id === qid);
            if (found) return found;
          }
          return null;
        }).filter(Boolean);
        return { success: true, test, questions: questionsList };
      }
      const res = await apiClient.get(`/exams/mock-tests/${testId}/questions`);
      return res.data;
    },

    submitMockTest: async (testId, resultData) => {
      // resultData: { score, totalQuestions, correctAnswers, wrongAnswers, timeSpentSeconds }
      if (useMock) {
        const stats = getLocalStats();
        // Calculate gains: 10 XP per correct answer, 50 XP completion bonus.
        const xpGain = (resultData.correctAnswers * 10) + 50;
        const coinsGain = (resultData.correctAnswers * 2) + 10;
        
        stats.xp += xpGain;
        stats.coins += coinsGain;
        stats.streak += 1;
        stats.level = Math.floor(stats.xp / 500) + 1;
        saveLocalStats(stats);

        // Certificate milestone triggers if percent correct >= 80%
        let cert = null;
        if ((resultData.correctAnswers / resultData.totalQuestions) >= 0.8) {
          cert = { id: Date.now(), title: 'Certificate of Excellence', milestone_name: 'Scored 80%+ on Mock Exam', issued_at: new Date().toISOString().split('T')[0] };
          mockDb.certificates.push(cert);
        }

        return {
          success: true,
          rewards: { xp: xpGain, coins: coinsGain, streak: stats.streak, newLevel: stats.level, levelUp: true, certificate: !!cert }
        };
      } else {
        const res = await apiClient.post('/exams/mock-tests/submit', { testId, ...resultData });
        return res.data;
      }
    },

    // Module 11: Flashcards
    getFlashcards: async () => {
      if (useMock) return { success: true, flashcards: mockDb.flashcards };
      const res = await apiClient.get('/exams/flashcards');
      return res.data;
    },

    createFlashcard: async (card) => {
      if (useMock) {
        const newCard = { id: Date.now(), ...card };
        mockDb.flashcards.push(newCard);
        return { success: true, card: newCard };
      }
      const res = await apiClient.post('/exams/flashcards', card);
      return res.data;
    },

    // Module 9: PYQs
    getPYQs: async (examId) => {
      if (useMock) return { success: true, papers: mockDb.pyqs };
      const res = await apiClient.get('/exams/pyqs', { params: { examId } });
      return res.data;
    },

    // Module 12: Bookmarks
    getBookmarks: async () => {
      if (useMock) return { success: true, bookmarks: mockDb.bookmarks };
      const res = await apiClient.get('/exams/bookmarks');
      return res.data;
    },

    addBookmark: async (bookmark) => {
      if (useMock) {
        const newB = { id: Date.now(), ...bookmark };
        mockDb.bookmarks.push(newB);
        return { success: true, bookmark: newB };
      }
      const res = await apiClient.post('/exams/bookmarks', bookmark);
      return res.data;
    }
  },

  // Modules 7, 8 & 15: AI Features
  ai: {
    solveDoubt: async (questionText, contextSubject, fileUrl) => {
      if (useMock) {
        // High quality simulated delay & formatted markdown responses
        await new Promise(r => setTimeout(r, 1000));
        return {
          success: true,
          solution: `### AI doubt Solver - Step-by-Step Response

Here is the analytical solution for your question on **${contextSubject || 'Advanced Concept'}**:

#### Query:
> *"${questionText}"*

#### Detailed Solution:
1. **Mathematical Representation**:
   Let the parameter be \\(y\\). The governing equilibrium states:
   \\[ \\int f(x)\\,dx = F(x) + C \\]
   Applying variables leads to:
   \\[ V_{\\text{eff}} = \\frac{1}{4\\pi \\epsilon_0} \\cdot \\frac{q}{r} \\]

2. **Step Breakdown**:
   * **Phase 1**: Resolve parallel constraints and isolate vectors.
   * **Phase 2**: Calculate coordinates and boundary differentials.
   * **Phase 3**: Establish final numerical validation.

#### Recommended Concepts to Review:
* **Vector Integration** & Flux distribution curves.
* **Coulombs Integral boundaries** under non-vacuum dielectrics.
`,
          relatedConcepts: ['Flux Distribution', 'Integral Boundaries', 'Vector Fields']
        };
      } else {
        const res = await apiClient.post('/ai/doubt-solve', { questionText, contextSubject, fileUrl });
        return res.data;
      }
    },

    generateQuestions: async (params) => {
      // params: { subject, topic, difficulty, count }
      if (useMock) {
        await new Promise(r => setTimeout(r, 850));
        const generated = [];
        for (let i = 1; i <= (params.count || 3); i++) {
          generated.push({
            id: 200 + i,
            question_text: `[AI Gen] Practice Question #${i}: Given the system properties of ${params.topic || 'General Concepts'}, what defines the standard rate?`,
            type: 'MCQ',
            option_a: 'Primary reactive coefficients',
            option_b: 'Stable energy boundary conditions',
            option_c: 'Gibbs thermodynamics coefficient',
            option_d: 'Entropy limit factors',
            correct_answer: 'B',
            difficulty: params.difficulty,
            solution: 'The rate balances entropy variables and standard boundary dynamics.'
          });
        }
        return { success: true, questions: generated };
      } else {
        const res = await apiClient.post('/ai/generate-questions', params);
        return res.data;
      }
    },

    generateStudyPlan: async (params) => {
      // params: { examName, availableHours, weakTopics, daysRemaining }
      if (useMock) {
        await new Promise(r => setTimeout(r, 900));
        return {
          success: true,
          plan: `### AI-Generated Revision Schedule for **${params.examName || 'JEE Main'}**
* **Time Left**: ${params.daysRemaining || 30} Days | **Daily Commitment**: ${params.availableHours || 4} Hours
* **Target Improvements**: ${params.weakTopics || 'Complex formulations & speed'}

---

#### 1. Daily Hourly Agenda:
* **Hour 1**: Revision of weak areas & formula logs.
* **Hour 2-3**: Continuous subject specific mock quizzes.
* **Hour 4**: Active recall, flashcard decks, and revision logging.

#### 2. Weekly Core Timeline:
* **Week 1-2**: Conceptual debugging, clearing notes on **${params.weakTopics || 'weak chapters'}**.
* **Week 3**: Full length mock exams under exam simulations.
* **Week 4**: High speed review, formula checks. No heavy topics.

#### 3. Revision Advice:
* Leverage **Mind Maps** for quick recall.
* Solve a minimum of 3 PYQ papers from 2023 & 2024.
`
        };
      } else {
        const res = await apiClient.post('/ai/study-plan', params);
        return res.data;
      }
    }
  },

  // Modules 13 & 14: Stats & Leaderboard
  stats: {
    getLocalStats: () => {
      return getLocalStats();
    },
    getLeaderboard: async () => {
      // Simulate leaderboard fetch
      return { success: true, leaderboard: mockDb.leaderboard };
    },
    getCertificates: async () => {
      return { success: true, certificates: mockDb.certificates };
    }
  },

  // Modules 20 & 21: Teacher & Admin panels
  teacher: {
    addQuestion: async (question) => {
      if (useMock) {
        const topicId = question.topicId || 1;
        const newQ = { id: Date.now(), question_text: question.questionText, ...question };
        if (!mockDb.questions[topicId]) mockDb.questions[topicId] = [];
        mockDb.questions[topicId].push(newQ);
        return { success: true, message: 'Question successfully added to bank.' };
      }
      return { success: true };
    }
  }
};
