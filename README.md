# ExamAce 🎓 – AI-Powered Exam Preparation & Analytics Platform

**ExamAce** is a modern, responsive, full-stack web application designed to help students prepare for high-stakes examinations (including Class 11, Class 12 Boards, JEE Main/Advanced, NEET UG, SSC, Banking, Railways, UPSC, and placement coding assessments).

The project features relational database schemas, a secure Node.js backend, and a rich React frontend built with a **Dual-Mode API Service**. If the backend server is offline or unreachable, the frontend automatically switches to a browser-storage-backed mock engine, ensuring that all dashboards, timed tests, AI duda solvers, and study planners remain fully interactive instantly!

---

## 🏗️ System Architecture

* **Frontend**: React.js, Tailwind CSS (Design System & Dark Theme), Lucide Icons
* **Backend**: Node.js, Express, JWT Authorization Middleware
* **AI Integration**: Google Gemini API (`@google/generative-ai`)
* **Database**: MySQL (relational structure for statistics, questions, test logs)

---

## 📁 Repository Structure

```
├── database/
│   ├── schema.sql      # MySQL Table DDL schemas
│   └── seed.sql        # Educational database seed data
│
├── backend/
│   ├── package.json    # Backend dependencies (express, mysql2, bcryptjs, jwt, gemini)
│   ├── server.js       # Main server entrypoint
│   ├── .env.example    # Configuration template
│   ├── config/
│   │   └── db.js       # MySQL Connection pool pool setup
│   ├── middleware/
│   │   └── auth.js     # JWT Token verification & role checks
│   ├── controllers/
│   │   ├── authController.js   # Login/Register, profiles controllers
│   │   ├── examController.js   # Mock tests, flashcards, bookmarks controllers
│   │   └── aiController.js     # Gemini API integration controllers
│   └── routes/
│       ├── authRoutes.js
│       ├── examRoutes.js
│       └── aiRoutes.js
│
└── frontend/
    ├── package.json    # Frontend dependencies (React, Tailwind, Lucide)
    ├── vite.config.js  # Vite compilation settings
    ├── tailwind.config.js
    ├── index.html      # Document template with Outfit/Plus Jakarta Sans Google Fonts
    └── src/
        ├── main.jsx    # Bootstrapping script
        ├── index.css   # HSL tokens, dark/light themes, scrollbars & animations
        ├── App.jsx     # Core router layout frame & tab state machine
        ├── services/
        │   └── api.js  # Dual-Mode connection client with mock engine fallback
        └── components/
            ├── AuthPages.jsx       # Login/Register role forms
            ├── Dashboard.jsx       # Streaks, daily study goals, countdowns
            ├── ExamsBrowser.jsx    # Category index, syllabus viewer
            ├── MockTestRunner.jsx  # Online test taker, navigators, results
            ├── DoubtSolver.jsx     # AI doubt chatbot with formula formatting
            ├── StudyPlanner.jsx    # Custom AI revision schedule generator
            ├── Analytics.jsx       # Progress graphs, rankings, printable PDFs
            └── Panels.jsx          # Teacher question manager & Admin panels
```

---

## ⚡ Setup & Installation

### Step 1: Database Setup
1. Ensure you have **MySQL Server** installed and running on port `3306`.
2. Connect to your database console and run:
   ```sql
   CREATE DATABASE examace_db;
   ```
3. Import the schemas and sample seed data:
   ```bash
   mysql -u root -p examace_db < database/schema.sql
   mysql -u root -p examace_db < database/seed.sql
   ```

### Step 2: Backend API Configuration
1. Open the `/backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file from the template:
   ```bash
   copy .env.example .env
   ```
4. Edit `.env` and fill in your database credentials and optional Google `GEMINI_API_KEY`.
5. Start the backend:
   ```bash
   npm start
   ```

### Step 3: Frontend Client Configuration
1. Open the `/frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite developer environment:
   ```bash
   npm run dev
   ```
4. Access the application on `http://localhost:3000`.

---

## 🤖 Dual-Mode API Fallback (Developer note)
If you wish to preview the fully functional application without setting up MySQL or a Gemini API key:
* Simply run the frontend client by itself.
* The API client (`src/services/api.js`) will detect that the Express API is offline and activate **Client-Side Simulation Mode**.
* This simulates mock login, profile edits, taking timed mock tests, receiving AI doubt solutions, creating memory flashcards, and incrementing streaks and XP levels locally.
