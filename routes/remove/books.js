const express = require('express');
const router = express.Router();
const { removeFromLibrary, buildRemoveQuery } = require('../../utils/dbHelpers');

router.delete('/from_library', async (req, res) => {
    const { book_id } = req.query;
    const user_id = req.session.user_id;
    const filters = {
        book_id: book_id,
        user_id: user_id
    }

    if (!book_id) {
        return res.status(400).json({Error: "Missing Book ID"});
    }

    if (!user_id) {
        return res.status(400).json({Error: "Missing User ID"});
    }

    try {
        const result = await buildRemoveQuery("book_copies", filters);
        // const result = await removeFromLibrary(book_id, user_id);

        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Book successfully removed from library" });
        } else {
            return res.status(404).json({ message: "Book not found in the library" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({Error: error})
    }
});

module.exports = router;