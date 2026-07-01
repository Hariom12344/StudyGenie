const { GoogleGenAI } = require('@google/generative-ai');
const db = require('../config/db');

// Instantiate Gemini API if key is present
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (error) {
    console.error('Failed to initialize Gemini API Client:', error.message);
  }
}

// 1. AI Doubt Solver
async function solveDoubt(req, res) {
  const userId = req.user.id;
  const { questionText, contextSubject, fileUrl } = req.body;

  if (!questionText) {
    return res.status(400).json({ success: false, message: 'Please enter your question or doubt.' });
  }

  try {
    let aiResponse = '';

    if (genAI) {
      // Create model interaction
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are ExamAce's expert AI Academic Doubt Solver. 
        Solve the following doubt. If applicable, provide step-by-step mathematical calculations, list related formulas, and suggest 2 key concept summaries at the end.
        
        Subject Context: ${contextSubject || 'General Science & Mathematics'}
        Question/Doubt: ${questionText}
        ${fileUrl ? `Image/PDF Attachment Path: ${fileUrl}` : ''}
      `;
      
      const result = await model.generateContent(prompt);
      aiResponse = result.response.text();
    } else {
      // Mock Fallback
      aiResponse = `### Step-by-Step Solution

Based on the core principles of **${contextSubject || 'Applied Physics'}**, here is the solution:

1. **Identify Given Data**:
   * Let the primary parameter \\(X\\) be related to the core query: *"${questionText}"*.
   * We apply the fundamental law of equations for this concept.

2. **Core Formula**:
   \\[ F = m \\cdot a \\quad \\text{or} \\quad E = m \\cdot c^2 \\]
   For this specific topic, the relation holds true as it balances the conservation of state.

3. **Step-by-Step Calculation**:
   * *Step A*: Analyze boundary conditions and substitute values.
   * *Step B*: Simplify the algebraic variables.
   * *Step C*: The final resulting parameter resolves to a stable coefficient.

### Related Concepts to Study:
* **Concept 1**: Conservation Principles and State Diagrams.
* **Concept 2**: Boundary Value Approximations.
`;
    }

    // Save transaction to AI History
    await db.query(
      'INSERT INTO ai_history (user_id, query_text, response_text, feature, file_attachment_url) VALUES (?, ?, ?, ?, ?)',
      [userId, questionText, aiResponse, 'Doubt Solver', fileUrl || null]
    );

    return res.json({
      success: true,
      solution: aiResponse,
      relatedConcepts: ['Conservation Laws', 'Boundary Conditions', 'Approximation Analysis']
    });
  } catch (error) {
    console.error('AI Solver error:', error);
    return res.status(500).json({ success: false, message: 'AI Doubt solver encountered an error.' });
  }
}

// 2. AI Question Generator
async function generateQuestions(req, res) {
  const { subject, topic, difficulty, count } = req.body;
  const numQuestions = count || 3;

  try {
    let questions = [];

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Generate ${numQuestions} academic questions on the subject "${subject}", topic "${topic}", with a difficulty level of "${difficulty}".
        Format the response strictly as a JSON array of objects. Each object must have:
        - "questionText": The question prompt.
        - "type": "MCQ" or "Numerical".
        - "optionA", "optionB", "optionC", "optionD" (only if MCQ).
        - "correctAnswer": "A", "B", "C", "D" (for MCQ) or a numeric value (for Numerical).
        - "solution": Detailed explanation.
      `;
      
      const result = await model.generateContent(prompt);
      const cleanedText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      questions = JSON.parse(cleanedText);
    } else {
      // Mock Fallback
      for (let i = 1; i <= numQuestions; i++) {
        questions.push({
          id: 100 + i,
          questionText: `Generated Question #${i}: What is the primary characteristic of ${topic || 'this chemical group'} in relation to ${subject || 'General Chemistry'}?`,
          type: 'MCQ',
          optionA: 'Option Alpha (Highly Reactive)',
          optionB: 'Option Beta (Completely Inert)',
          optionC: 'Option Gamma (Variable)',
          optionD: 'Option Delta (Thermal Resistor)',
          correctAnswer: 'A',
          difficulty: difficulty || 'Medium',
          solution: `The reactive behavior is defined by its outer electron shells.`
        });
      }
    }

    return res.json({ success: true, questions });
  } catch (error) {
    console.error('AI Question Gen error:', error);
    return res.status(500).json({ success: false, message: 'AI Question generator encountered an error.' });
  }
}

// 3. AI Study Planner
async function generateStudyPlan(req, res) {
  const { examName, availableHours, weakTopics, daysRemaining } = req.body;

  try {
    let planText = '';

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Create a personalized study schedule for the exam "${examName}".
        The student has ${daysRemaining} days remaining, can study ${availableHours} hours daily, and is weak in: ${weakTopics || 'None specified'}.
        Provide:
        1. A daily time split.
        2. A week-by-week priority sequence.
        3. A final 3-day revision strategy.
        Format the response in clear Markdown.
      `;
      const result = await model.generateContent(prompt);
      planText = result.response.text();
    } else {
      planText = `### Personalized Study Plan for **${examName || 'JEE Main'}**
* **Time Remaining**: ${daysRemaining || 30} Days
* **Study Hours**: ${availableHours || 4} Hours/Day
* **Focus Area**: Remediation of weak topics: *${weakTopics || 'Formula derivation & calculations'}*

---

#### Daily Schedule Breakdown:
* **Hour 1-2**: Conceptual review & solving mock items on weak areas.
* **Hour 3**: High-intensity mock quiz (30 minutes) + speed calibration.
* **Hour 4**: Active recall using Flashcards & revising previous year questions.

#### Weekly Progression Plan:
* **Week 1-2**: Conceptual reinforcement of weak areas.
* **Week 3**: Core topic quizzes and error-log analysis.
* **Week 4**: Daily full-length mock examinations + stress management simulation.

#### Revision Strategy (Final 3 Days):
* Review key formula sheets and high-yield mind maps only.
* No new topics. Complete 1 light speed-test daily.
`;
    }

    return res.json({ success: true, plan: planText });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'AI Study planner encountered an error.' });
  }
}

module.exports = {
  solveDoubt,
  generateQuestions,
  generateStudyPlan
};
