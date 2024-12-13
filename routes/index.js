
const addBooks = require('./add/books');
const getBooks = require('./get/books');
const removeBooks = require('./remove/books');
const authRoute = require('./auth');

module.exports = (app) => {
    app.use('/auth', authRoute);
    app.use('/add', addBooks);
    app.use('/get', getBooks);
    app.use('/remove', removeBooks,);
    // app.use('/api', update);
    // app.use('/api', destroy);
};