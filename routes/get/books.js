const express = require('express');
const router = express.Router();
const db = require('../../db');
const { Author, Book, BookCopy, User } = require('../..');

// route for user owned books
router.get('/my_books', async (req, res) =>{
    try{
        const session_user = req.session.user_id;

        if (!session_user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await Book.FindAll({
            attributes: ['title'],
            include: [
                {
                    mode: Authorm,
                    attributes: ['auth_name'],
                    through: { attribuits: [] },
                },
                {
                    model: BookCopy,
                    where: { user_id: userId },
                    include: [
                        {
                            model: users,
                            required: true
                        }
                    ]
                }
            ]

        });

        public_books = result.map(book  => ({
            title: book.title,
            authors: book.authors.map(author => author.auth_name)
        }));

        return res.json(public_books.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// route for public books
router.get('/public_books', async (req, res) => {
    try {
        // const query = `
        // SELECT title FROM books WHERE availability = 'PUBLIC'
        // `;

        const public_books = await Book.findAll({
            where: {
                availability: 'PUBLIC'
            },
            attributes: ['title']
        })

        const bookTitles = public_books(book => book.title);

        return res.json(bookTitles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;