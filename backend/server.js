const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'Healthy',
    timestamp: new Date()
  });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// Initialize and start server
async function startServer() {
  // Test MySQL connection pool
  const dbConnected = await db.checkConnection();
  if (!dbConnected) {
    console.warn('Warning: Server starting without active database pool. API requests will fail if DB is not configured.');
  }
  
  app.listen(PORT, () => {
    console.log(`ExamAce Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer();
