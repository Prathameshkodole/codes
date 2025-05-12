// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Hardcoded credentials
const validUserId = 'admin';
const validPassword = '1234';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle POST form submission
app.post('/login', (req, res) => {
    const { userid, password } = req.body;

    if (userid === validUserId && password === validPassword) {
        res.send(`<h2>Welcome, ${userid}!</h2>`);
    } else {
        res.send('<h2>Invalid credentials. Please try again.</h2>');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
