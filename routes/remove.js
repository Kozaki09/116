const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { buildBookQuery, buildRemoveQuery } = require('../middleware/query-builders');
const { getSession } = require('../utils/helpers');
const router = express.Router();

router.delete('/from_library', isAuthenticated, async (req, res) => {
    const { book_id } = req.query;
    const user = getSession(req);
    const remove = {
        book_id: book_id,
        user_id: user.id
    }

    if (!book_id) {
        return res.status(400).json({Erro: "Missing Book ID"});
    }

    try {
        const result = await buildBookQuery("books", ["availability"], {id: book_id});
        const isPrivate = result.rows[0].availability === "PRIVATE";

        let removed = 0;
        if (isPrivate) {
            const removeBook = await buildRemoveQuery("books", {id: book_id});
            removed += removeBook.rowCount;
        }

         const removeCopy = await buildRemoveQuery("book_copies", remove);
         removed = removeCopy.rowCount;

         if (removed > 0) {
            return res.status(200).json({ message: "Book succesfuly removed from library."});
         } else {
            return res.status(400).json({ message: "Failed to remove book from library."});
         }
    } catch (error) {
        console.error(error);
        return res.status(500).json({Error: error});
    }
});

module.exports = router;