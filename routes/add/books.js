const express = require('express');
const router = express.Router();
const db = require('../../db');

const { Book } = require('../../test');
const { buildSearchQuery, buildInsertQuery } = require('../../utils/dbHelpers');

router.post('/newBook', async (req,res) => {
    try {
        const { title, isbn, authors, publisher, publication, availability } = req.body;
        const session_user = req.session.user_id;
        const filters = {isbn: isbn};
        const insertBook = {
            title: title,
            isbn: isbn,
            publisher: publisher || null,
            publication: publication || null,
            availability: (availability && availability.toUpperCase()) || 'PUBLIC'
        };

        const isbn_check = await buildSearchQuery("books", [], filters);
        if (isbn_check.rowCount > 0) {
            return res.send(`
                <script>
                    alert('ISBN already exists in library!');
                    window.location.href = '/submit_book';
                </script>
                `)
        }

        const authorList = authors.split(',').map( a => a.trim());
        let authListID = [];

        if (authorList.length > 0) {
            for (const author of authorList) {
                const get = ["id"];
                const filters = {auth_name: author};
                const author_id = await buildSearchQuery("authors", get, filters);

                if (author_id.rows.length === 0) {
                    author_id = await buildInsertQuery("authors", {auth_name: author}, "id");
                }

                authListID.push(author_id.rows[0].id);
            }
        }

        const newBook_id = await buildInsertQuery("books", insertBook);                                 // insert to server library
        await buildInsertQuery("book_copies", {book_id: newBook_id, user_id: req.session.user_id});     // insert to user library
        for (const auth_id of authListID) {                                                             // set book author(s)
            await buildInsertQuery("book_authors", {book_id: newBook_id, auth_id: auth_id});
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

router.post('/my_library', async (req, res) => {
    const { book_id } = req.query;
    const insert = {
        user_id: req.session.user_id,
        book_id: book_id
    };
    
    try {   
        await buildInsertQuery("book_copies", insert);
        return res.json({ message: 'Book added to your library.' });
    } catch (error) {
        console.error('Error adding book to library:', error);
        return res.status(500).json({ message: 'Failed to add book to library.' });
    }
});

module.exports = router;