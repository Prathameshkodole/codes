const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', (req, res) => {
  const { name, email, course } = req.body;
  const sql = 'INSERT INTO students (name, email, course) VALUES (?, ?, ?)';
  db.query(sql, [name, email, course], (err, result) => {
    if (err) {
      console.error(err);
      return res.send('Database error');
    }
    res.send('Student registered successfully!');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
