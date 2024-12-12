const express = require('express');
const router = express.Router();
const db = require('../../db')

router.post('/submit_book', async (req,res) => {
    try {
        const { title, isbn, authors, publisher, publication, availability} = req.body;

        const bookData = {
            title,
            isbn,
            authors: authors || "Unknown",
            publication: publication || "Unknown"
        };

        const newBook = 

    } catch (error) {

    }
});

module.exports = router;