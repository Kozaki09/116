const express = require('express');
const router = express.Rooks();
const db = require('../../db')

// route for user owned books
router.get('/my_books', async (req, res) =>{
    try{
        const session_user = req.session.user_id;
        const query = `
        SELECT books.title, books.author 
        FROM books 
        JOIN book_copies ON book_copies.book_id = books.id 
        JOIN users ON book_copies.user_id = users.id 
        WHERE users.id = $1
        `;
        const result = await db.query(query, [session_user]);
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

// route for public books
router.get('/public_books', async (req, res) => {
    try {
        const query = `
        SELECT title, author FROM books WHERE availability = 'PUBLIC'
        `;

        const result = await db.query(query);

        return res.json(result.rows);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;