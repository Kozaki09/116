const express = require('express');
const router = express.Router();
const { isAuthenticated, isOwned } = require('../../middleware/auth');
const { buildBookQuery, getBookCopy, getMyLibrary, getPublicLibrary, getBook, getUserCopy } = require('../../utils/dbHelpers');

// route for user owned books
router.get('/my_library', isAuthenticated, async (req, res) =>{
    filters = {user_id: req.session.user_id};

    try{
        const result = await buildBookQuery(filters);
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// route for public books
router.get('/public_books', async (req, res) => {
    filter = {}
    try {
        const result = await buildBookQuery();

        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/book', isOwned, async (req, res) => {
    const book_id = req.query.book_id;
    const user = {
        id: req.session.user_id,
        name: req.session.user_name,
        role: req.session.isAdmin ? "Admin" : "User"
    }
    filters = { book_id: book_id };
    try {

        const details = await buildBookQuery(filters);
        const result = await getUserCopy(user.id, book_id);
        const isOwned = result.rows.length > 0;

        res.render('book', { book: details.rows[0], isOwned: isOwned, user });
    } catch (error) {
        console.error('Error trying to display book: ', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;