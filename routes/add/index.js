const books = require('./books');

module.exports = (app) => {
    app.use('/add', books);
};