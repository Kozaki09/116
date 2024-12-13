const books = require('./books');

module.exports = (app) => {
    app.use('/get', books);
};