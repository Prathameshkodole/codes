const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3306;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'studentdb'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
});

// Route to display all students with an "Edit" option
app.get('/', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) {
            console.error('Error querying students: ' + err);
            res.status(500).send('Error fetching student data');
            return;
        }
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Information</title>
            </head>
            <body>
                <h1>Student Information</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        results.forEach(student => {
            html += `
                        <tr>
                            <td>${student.id}</td>
                            <td>${student.name}</td>
                            <td>
                                <a href="/edit/${student.id}">Edit</a>
                            </td>
                        </tr>
            `;
        });
        html += `
                    </tbody>
                </table>
            </body>
            </html>
        `;
        res.send(html);
    });
});

// Route to display the edit form for a specific student
app.get('/edit/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error('Error fetching student for edit: ' + err);
            res.status(500).send('Error fetching student data for editing');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Student not found');
            return;
        }
        const student = results[0];
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Edit Student</title>
            </head>
            <body>
                <h1>Edit Student</h1>
                <form action="/update/${student.id}" method="post">
                    <label for="name">Name:</label><br>
                    <input type="text" id="name" name="name" value="${student.name}"><br><br>
                    <button type="submit">Update</button>
                </form>
                <br>
                <a href="/">Back to Student List</a>
            </body>
            </html>
        `;
        res.send(html);
    });
});

// Route to handle the update of student information
app.post('/update/:id', (req, res) => {
    const studentId = req.params.id;
    const updatedName = req.body.name;
    const sql = 'UPDATE students SET name = ? WHERE id = ?';
    db.query(sql, [updatedName, studentId], (err, result) => {
        if (err) {
            console.error('Error updating student: ' + err);
            res.status(500).send('Error updating student data');
            return;
        }
        console.log(`Updated student with ID: ${studentId}`);
        res.redirect('/'); // Redirect back to the student list
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});