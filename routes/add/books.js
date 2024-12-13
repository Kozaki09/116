const express = require('express');
const router = express.Router();

const { Book } = require('../../test');

router.post('/newBook', async (req,res) => {
    try {
        const { title, isbn, authors, publisher, publication, availability} = req.body;
        const session_user = req.session.user_id;

        const bookData = {  
            title,
            isbn,
            publication: publication || null,
            availability: availability.toUpperCase()
        };

        const query = `SELECT isbn FROM books WHERE isbn = $1`;
        const isbn_check = await db.query(query, [bookData.isbn]);
        if (isbn_check.rows.length > 0) {
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
                const searchAuthor = 'SELECT id FROM authors WHERE auth_name = $1;';
                let author_id = await db.query(searchAuthor, [author])

                if (author_id.rows.length === 0) {
                    author_id = addAuthor(author);
                }

                authListID.push(author_id.rows[0].id);
            }
        }

        const newBook_id = await newBook(bookData);
        await addToUser(newBook_id, req.session.user_id);
        await setAuthors(newBook_id, authListID)

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
    const { bookId} = req.body;
    session_user = req.session.user_id;
    try {   
        await addToUser(session_user, bookId);
        return res.send(`
            <script>
                alert('Book added to your library.');
                window.location.href = '/';
            </script>
        `);
    } catch (error) {
        console.error('Error adding book to library:', error);
        return res.send(`
            <script>
                alert('Failed to add book to library.');
                window.location.href = '/';
            </script>
        `);
    }
});

const newBook = async (bookData) => {
    const query = `INSERT INTO books (title, isbn, publication, availability)
        VALUES ($1, $2, $3, $4) RETURNING id;
        `;

    const newBook = await db.query(query, [
        bookData.title,
        bookData.isbn,
        bookData.publication,
        bookData.availability
    ]);

    return newBook.rows[0].id;
};

const addToUser = async (book_id, session_user) => {
    const query = `INSERT INTO book_copies (user_id, book_id) VALUES ($1, $2);`;
    await db.query(query, [session_user, book_id]);
};

const addAuthor = async (author) => {
    const query = `INSERT INTO authors (auth_name) VALUES ($1) RETURNING id`;
    const author_id = await db.query(query, [author]);

    return author_id;
}

const setAuthors = async (book_id, authListID) => {
    for (const auth_id of authListID) {
        const query = `INSERT INTO book_authors (book_id, auth_id) VALUES ($1, $2);`;
        await db.query(query, [book_id, auth_id]);
    }
}

module.exports = router;