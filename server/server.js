const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Configuration
const dbConfig = {
  host: 'localhost',
  user: 'root', // Update with your MySQL username
  password: 'password', // Update with your MySQL password
  database: 'unisched_db'
};

let pool;

async function initializeDB() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('Connected to MySQL Database');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

initializeDB();

// --- Routes ---

// GET all sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM class_sessions');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new session
app.post('/api/sessions', async (req, res) => {
  const { id, subjectCode, subjectName, professor, room, year, section, day, startMinutes, durationMinutes } = req.body;
  try {
    const sql = `INSERT INTO class_sessions (id, subjectCode, subjectName, professor, room, year, section, day, startMinutes, durationMinutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await pool.execute(sql, [id, subjectCode, subjectName, professor, room, year, section, day, startMinutes, durationMinutes]);
    res.status(201).json({ message: 'Session created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update session
app.put('/api/sessions/:id', async (req, res) => {
  const { id } = req.params;
  const { subjectCode, subjectName, professor, room, year, section, day, startMinutes, durationMinutes } = req.body;
  try {
    const sql = `UPDATE class_sessions SET subjectCode=?, subjectName=?, professor=?, room=?, year=?, section=?, day=?, startMinutes=?, durationMinutes=? WHERE id=?`;
    await pool.execute(sql, [subjectCode, subjectName, professor, room, year, section, day, startMinutes, durationMinutes, id]);
    res.json({ message: 'Session updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE session
app.delete('/api/sessions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM class_sessions WHERE id = ?', [id]);
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`UniSched Server running on http://localhost:${PORT}`);
});