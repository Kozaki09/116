const express = require('express');
const router = express.Router();
const { isAuthenticated, isOwned } = require('../../middleware/auth');
const { getBookCopy, getMyLibrary, getPublicLibrary } = require('../../utils/dbHelpers');

// route for user owned books
router.get('/my_library', isAuthenticated, async (req, res) =>{
    try{
        const result = await getMyLibrary(req.session.user_id);

        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// route for public books
router.get('/public_books', async (req, res) => {
    try {
        const result = await getPublicLibrary();

        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/book/:id', isOwned, async (req, res) => {
    const book_id = req.params.id;
    try {
        const details = getBookCopy(book_id);
        res.render('book', { book: details });
    } catch (error) {
        console.error('Error trying to display book: ', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;