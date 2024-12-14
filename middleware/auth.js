const { sendHtmlFile, redirectBack } = require('../utils/helpers');
const { buildSearchQuery, isPublic } = require('../utils/dbHelpers');

function isAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
        return next();
    } else {
        sendHtmlFile(res, 'public/login_create.html');
    }
}

function isOwned(req, res, next) {
    const book_id = req.params.id;
    const user_id = req.session.user_id;

    filters = {
        book_id: req.params.id,
        user_id: req.session.user_id
    }


    if (isPublic) {
        return next();
    }

    try {
        const result = buildSearchQuery("book_copies", [], filters);

        if (result.rows.length > 0) {
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