const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeyexamace123!';

// Register user
async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
  }

  const selectedRole = role || 'Student';

  try {
    // Check if user exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, selectedRole, true] // Default verified for ease of local testing
    );

    const userId = result.insertId;

    // Create profile
    await db.query(
      'INSERT INTO profiles (user_id, avatar_url) VALUES (?, ?)',
      [userId, `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`]
    );

    // Create statistics/gamification
    if (selectedRole === 'Student') {
      await db.query(
        'INSERT INTO user_stats (user_id, xp, streak, coins, level, last_active) VALUES (?, 0, 1, 0, 1, CURDATE())',
        [userId]
      );
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
}

// Login user
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retrieve stats if student
    let stats = null;
    if (user.role === 'Student') {
      const [statRows] = await db.query('SELECT xp, streak, coins, level FROM user_stats WHERE user_id = ?', [user.id]);
      if (statRows.length > 0) {
        stats = statRows[0];
      }
    }

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        stats
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
}

// Get Profile
async function getProfile(req, res) {
  const userId = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT u.name, u.email, u.role, p.phone, p.avatar_url, p.school_college, p.branch, p.class_name, p.semester, p.preferred_exam, p.target_score, p.bio 
       FROM users u 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE u.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    return res.json({ success: true, profile: rows[0] });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
}

// Update Profile
async function updateProfile(req, res) {
  const userId = req.user.id;
  const { name, phone, school_college, branch, class_name, semester, preferred_exam, target_score, bio, avatar_url } = req.body;

  try {
    // Update users table name
    if (name) {
      await db.query('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
    }

    // Update profiles table
    await db.query(
      `UPDATE profiles SET 
       phone = ?, school_college = ?, branch = ?, class_name = ?, semester = ?, preferred_exam = ?, target_score = ?, bio = ?, avatar_url = ?
       WHERE user_id = ?`,
      [phone || null, school_college || null, branch || null, class_name || null, semester || null, preferred_exam || null, target_score || 90, bio || null, avatar_url || null, userId]
    );

    return res.json({ success: true, message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
}

// Simulate Forgot Password
async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide email' });
  }
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No account with that email exists' });
    }
    // Simulate email dispatch
    return res.json({ success: true, message: 'Password reset link sent to registered email' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Simulate Reset Password
async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ success: false, message: 'Please enter new password' });
  }
  try {
    // In a fully-realized version, we check the reset token in the database.
    // For demo purposes, we will reset the password of a designated account or simulate success
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Simulation success
    return res.json({ success: true, message: 'Password reset successful!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword
};
