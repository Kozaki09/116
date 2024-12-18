const express = require('express');
const router = express.Router();
const { isAuthenticated, isOwned } = require('../middleware/auth');
const { getSession, formatBookResults } = require('../utils/helpers');
const { buildInsertQuery, buildSearchQuery } = require('../middleware/query-builders');

router.post('/to_my_library', isAuthenticated, async (req, res, next) => {
    const  { book_id } = req.query.book_id;
    const user = getSession(req);
    req.book_id = book_id;
    next();
}, isOwned, async (req, res) => {
    const user = getSession(req);

    console.log('User id: ', user.id);
    console.log('Book id: ', book_id);

    try {
        await buildInsertQuery("book_copies", {user_id: user.id, book_id: book_id});
        return res.json({ message: 'Book added to your library.'});
    } catch (error) {
        console.error('Error adding book to library:', error);
        return res.status(500).json({ message: `Failed to add book to user library.`});
    }
})

router.post('/book_submission', isAuthenticated, async (req, res) => {
    const { title, isbn, authors, publisher, publication, availability } = req.body;
    const user = getSession(req);
    const insertBook = {
        title: title,
        isbn, isbn,
        pub_id: null,
        publication: publication || null,
        availability: availability || 'public'
    };

    try {
        const isbn_check = await buildSearchQuery("books", [], {isbn: isbn});
        if (isbn_check.rowCount > 0) {
            return res.status(409).send(`
                <script>
                    alert('ISBN already exists in library!');
                    window.location.href = '/get/submit_book';
                </script>
            `);
        }

        const authorList = authors.split(', ').map( a => a.trim());
        let authListID = [];
        console.log(authorList);

        if (authorList.length > 0) {
            for (const author of authorList) {
                let author_id = await buildSearchQuery("authors", ["id"], {auth_name: author});
                if (author_id.rowCount === 0) {
                    author_id = await buildInsertQuery("authors", {auth_name: author}, "id");
                }

                authListID.push(author_id.rows[0].id);
            }
        }

        const publisher_check = await buildSearchQuery("publishers", ["id"], {pub_name: publisher});
        if (publisher_check.rowCount > 0) {
            insertBook.pub_id = publisher_check.rows[0].id;
        } else {
            const result = await buildInsertQuery("publishers", {pub_name: publisher}, "id");
            insertBook.pub_id = result.rows[0].id;
        }

        const result = await buildInsertQuery("books", insertBook, "id");
        const newBook_id = result.rows[0].id;
        await buildInsertQuery("book_copies", {book_id: newBook_id, user_id: user.id});
        for (const auth_id of authListID) {
            await buildInsertQuery("book_authors", {book_id: newBook_id, auth_id: auth_id});
        }

        return res.send(`
                <script>
                    alert('Book added.');
                    window.location.href= '/';
                </script>
            `);
    } catch (error) {
        console.error('Error submitting book: ', error);
        return res.status(500).send(`
                <script>
                    alert('Failed to submit book.');
                    window.location.href = /get/submit_book';
                </script>
            `);
    }
});

module.exports = router;