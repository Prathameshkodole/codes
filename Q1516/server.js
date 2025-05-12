const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/Book');  // Assuming Book model is defined in models/Book.js

const app = express();
app.use(express.json());  // Use built-in JSON middleware

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Add a new book
app.post('/books', async (req, res) => {
    try {
        const { title, author, isbn, year } = req.body;

        if (!title || !author || !isbn || !year) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if book with the same ISBN exists
        const existingBook = await Book.findOne({ isbn });
        if (existingBook) {
            return res.status(409).json({ message: "Book with this ISBN already exists." });
        }

        // Create new book
        const newBook = new Book({ title, author, isbn, year });
        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Error adding the book.', error: error.message });
    }
});

// Get a list of all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving books.', error: error.message });
    }
});

// Get a book by ISBN
app.get('/books/:isbn', async (req, res) => {
    try {
        const book = await Book.findOne({ isbn: req.params.isbn });
        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching the book.', error: error.message });
    }
});

// Update a book by ISBN
app.put('/books/:isbn', async (req, res) => {
    try {
        const updatedBook = await Book.findOneAndUpdate(
            { isbn: req.params.isbn },
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found." });
        }
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Error updating the book.', error: error.message });
    }
});

// Delete a book by ISBN
app.delete('/books/:isbn', async (req, res) => {
    try {
        const deletedBook = await Book.findOneAndDelete({ isbn: req.params.isbn });

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found." });
        }
        res.json({ message: "Book deleted successfully.", book: deletedBook });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting the book.', error: error.message });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
