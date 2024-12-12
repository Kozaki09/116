const express = require('express');
const router = express.Router();
const db = require('../../db')

// route for user owned books
router.get('/my_books', async (req, res) =>{
    try{
        const session_user = req.session.user_id;

        if (!session_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const query = `
            SELECT books.title, authors.auth_name 
            FROM books
            JOIN book_copies ON books.id = book_copies.book_id
            JOIN users ON users.id = book_copies.user_id
            JOIN book_authors ON books.id = book_authors.book_id
            JOIN authors ON book_authors.auth_id = authors.id
            WHERE users.id = $1;
        `;
        const result = await db.query(query, [session_user]);
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// route for public books
router.get('/public_books', async (req, res) => {
    try {
        const query = `
        SELECT title FROM books WHERE availability = 'PUBLIC'
        `;

        const result = await db.query(query);

        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;