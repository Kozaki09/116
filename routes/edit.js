const express = require('express');
const { isAuthenticated, isOwned } = require('../middleware/auth');
const { getSession } = require('../utils/helpers');
const { buildSearchQuery, buildRemoveQuery, buildInsertQuery, buildUpdateQuery } = require('../middleware/query-builders');
const router = express.Router();

router.post('/book', isAuthenticated, async (req, res, next) => {
    const { book_id, title, isbn, availability,authors, publisher, publication,
        title_input, isbn_input, availability_input, authors_input, publisher_input, publication_input
     } = req.body;

    // set book update details, exclude original values
    req.update = {
        id: book_id,
        title: title_input && title_input !== title ? title_input : null,
        isbn: isbn_input && isbn_input !== isbn ? isbn_input : null,
        availability: availability_input && availability_input !== availability ? availability_input : null,
        publication: publication_input && publication_input !== publication ? publication_input : null,
        pub_id: null
    };

    req.authors = authors_input && authors_input !== authors ? authors_input : null;
    req.publisher = publisher_input && publisher_input !== publisher ? publisher_input : null;

    next();
}, isOwned, async (req, res) => {
    try {
        const book = req.update;
        const pub_name = req.publisher;
        const authors = req.authors;

        // check for existing ISBN if provided
        if (book.isbn) {
            const isbn_check = await buildSearchQuery("books", [], { isbn: book.isbn });
            if (isbn_check.rowCount > 0) {
                return res.send(`
                    <script>
                        alert('Error: ISBN already exists in library!');
                        window.location.href = '/';
                    </script>
                `);
            }
        }

        // remove and update book authors if provided
        if (authors) {
            await buildRemoveQuery("book_authors", {book_id: book.id});
            const authorList = authors.split(',').map( a => a.trim());
            if (authorList.length > 0) {
                for (const author of authorList) {
                    let results = await buildSearchQuery("authors", ["id"], {auth_name: author});
        
                    if (results.rowCount === 0) {
                        results = await buildInsertQuery("authors", {auth_name: author}, "id");
                    }
        
                    await buildInsertQuery("book_authors", {book_id: book.id, auth_id: results.rows[0].id});
                }
            }
        }

        // check for existing publisher, if not found add to publishers table
        if (pub_name) {
            const publisher_check = await buildSearchQuery("publishers", ["id"], {pub_name: pub_name});
            if (publisher_check.rowCount === 0) {
                const publisher = await buildInsertQuery("publishers", {pub_name: pub_name}, "id");
                book.pub_id = publisher.rows[0].id;
            }
        }

        // update book record
        const result = await buildUpdateQuery("books", book, {id: book.id});
        if (result.rowCount === 0) {
            throw new Error('No were rows updated.');
        }

        return res.send(`
            <script>
                alert('Book Modified');
                    window.location.href = '/';
            </script>    
        `)
    } catch (error) {
        console.log('Error: ', error);
        return res.sendStatus(500).send(`
            <script>
                alert('Failed to edit book.');
                window.location.href = '/';
            </script>
        `);
    }
});

module.exports = router;