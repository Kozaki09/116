const express = require('express');
const router = express.Router();
const db = require('../../db');

const { Book } = require('../..');

router.post('/submit_book', async (req,res) => {
    try {
        const { title, isbn, authors, publisher, publication, availability} = req.body;
        const session_user = req.session.user_id;

        const bookData = {  
            title,
            isbn,
            publisher: publisher || "Unknown",
            publication: publication || "Unknown",
            availability: availability.toUpperCase()
        };

        const authorList = authors.split(',').map( a => a.trim());
        let authListID = [];

        for (const author of authorList) {
            const searchAuthor = 'SELECT id FROM authors WHERE auth_name = $1;';
            let author_id = await db.query(searchAuthor, [author])

            if (author_id.rows.lenth === 0) {
                const addAuthor = 'INSERT INTO authors (auth_name) VALUES ($1);';
                author_id = await db.query(addAuthor, [author]);
            }

            authListID.push(author_id.rows[0].id);
        }

        const newBook = await db.query(newBook, [bookData]);
        const addBook = 'INSERT INTO book_copies (user_id, book_id) VALUES ($1, $2);';
        await db.query(addBook, [session_user, newBook_id]);

        for (const author_id of authListID) {
            const addAuthor = 'INSERT INTO book_copies (book_id, auth_id) VALUES ($1, $2);';
            await db.query(addAuthor, [newBook_id, author_id]);
        }

        return res.send(`
            <script>
                alert('Book Added.');
                window.location.href = '/';
            </script>
            `)
    } catch (error) {
        console.error('Error adding book:', error);
        return res.send(`
            <script>
                alert('Something went wrong.');
                window.location.href = '/submit_book';
            </script>
            `)
    }
});

module.exports = router;