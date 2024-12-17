const { isAuthenticated, isOwned } = require('../middleware/auth');
const { buildBookQuery, buildSearchQuery } = require('../middleware/query-builders');
const { formatBookResults, getSession } = require('../utils/helpers');

const express = require('express');
const router = express.Router();

router.get('/browse_books', isAuthenticated, async (req, res) => {
    const user = await getSession(req);
    filters = {user_id: user.direction, public: true};

    const results = await buildBookQuery(filters);
    const books = formatBookResults(results);

    return res.render('public/browse_books', {
        books,
        user
    });
});

router.get('/book', isAuthenticated, async (req, res, next) =>{
    const book_id = req.query.book_id;
    const user = getSession(req);

    req.book_id = book_id;
    next();
    }, isOwned, async (req, res) => {
    try {
        const user = getSession(req);
        const results = await buildBookQuery({book_id: book_id});
        if (results.rowCount === 0) {
            throw new Error("Book ID not found.");
        }
        const copy = await buildSearchQuery("book_copies", [], {user_id: user.id, book_id: book_id});
        const isOwned = copy.rowCount > 0;
        const books = formatBookResults(results);

        return res.render('public/book', {
            book: books[book_id],
            isOwned,
            user
        })
    } catch (error) {
        console.error('Error trying to display book: ', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get('/submit_book', isAuthenticated, (req, res) => {
    const user = getSession(req);
    return res.render('public/submit_book', {user});
});



module.exports = router;