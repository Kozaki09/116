const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { getSession, formatBookResults } = require('../utils/helpers');

router.get('/', isAuthenticated, (req, res) => {
    const user =  getSession(req);
    try {
        if (user.isAdmin) {
            const admin_results =  buildBookQuery();
            const admin_books =  formatBookResults(admin_results);

            return res.render('private/dashboard', {
                books: admin_books,
                user
            })
        }

        const user_results =  buildBookQuery({user_id: user.id});
        const user_books =  formatBookResults(user_results);

        return res.render('public/dashboard', {
            books: user_books,
            user
        });
    } catch (error) {
        console.error('Error retrieving dashboard: ', error);
        return res.status(500);
    }
}) 

router.get('/submit_book', isAuthenticated,  (req, res) => {
    res.render('public/submit_book')
})

module.exports = router;