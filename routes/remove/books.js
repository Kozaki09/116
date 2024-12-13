const express = require('express');
const router = express.Router();
const { removeFromLibrary } = require('../../utils/dbHelpers');

router.post('/from_library', async (req, res) => {
    const { book_id } = req.body;

    if (!book_id) {
        return res.status(400).json({Error: "Missing Book ID"});
    }

    try {
        const result = await removeFromLibrary(book_id, req.session.user_id);

        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Book successfully removed from library" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({Error: error})
    }
});

module.exports = router;