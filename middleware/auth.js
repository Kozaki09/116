const { getSession, redirectBack } = require('../utils/helpers');
const { buildSearchQuery, buildBookQuery } = require('./query-builders');

function isAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
        return next();
    } else {
        return res.render('public/login_create');
    }
}

async function isOwned(req, res, next) {
    try {
        const user =  getSession(req);
        book_id = req.book_id;

        if (!user || !user.id) {
            return res.render('public/login_create', {message: 'You need to log in first'});
        }

        const availability = await buildBookQuery("books", ["availability"], {id: book_id});
        const isPublic = availability.rows[0].availability === 'PUBLIC' ? true : false;

        if (isPublic) {
            return next();
        }

        filters = {
            book_id: book_id,
            user_id: user.id
        }
        const result = await buildSearchQuery("book_copies", [], filters);

        if (result.rowCount > 0) {
            return next();
        } else {
            return redirectBack(req, res, message = 'You do not have access to this book.');
        }
    } catch (error) {
        console.error('Error trying to check ownership: ', error);
        throw error;
    }
}

module.exports = {
    isAuthenticated,
    isOwned,
}