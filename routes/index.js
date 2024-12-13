
const addBooks = require('./add/books');
const getBooks = require('./get/books');
// const update = require('./update');
// const destroy = require('./destroy');

module.exports = (app) => {
    app.use('/add', addBooks);
    app.use('/get', getBooks);
    // app.use('/api', update);
    // app.use('/api', destroy);
};