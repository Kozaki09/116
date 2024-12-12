const get = require('./get/books');
const action = require('./action/books');

module.exports = (app) => {
    app.use('/get', get);
    app.use('/action', action)
};