const router = require('./data/books');

module.exports = (app) => {
    app.use('/data', router);
};