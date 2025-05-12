// server.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Retrieve all students
app.get('/students', (req, res) => {
  const sql = 'SELECT * FROM students';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// Add a new student
app.post('/students', (req, res) => {
  const { name, email, course } = req.body;
  const sql = 'INSERT INTO students (name, email, course) VALUES (?, ?, ?)';
  db.query(sql, [name, email, course], (err, result) => {
    if (err) {
      console.error('Error adding student:', err);
      return res.status(500).send('Database error');
    }
    res.status(201).send('Student added successfully');
  });
});

// Delete a student by ID
app.delete('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const sql = 'DELETE FROM students WHERE id = ?';
  db.query(sql, [studentId], (err, result) => {
    if (err) {
      console.error('Error deleting student:', err);
      return res.status(500).send('Database error');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Student not found');
    }
    res.sendStatus(200);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
