const addRoute = require('./add');
const getRoute = require('./get');
const authRoute = require('./auth');
const removeRoute = require('./remove');

module.exports = (app) => {
    app.use('/add', addRoute);
    app.use('/get', getRoute);
    app.use('/auth', authRoute);
    app.use('/remove', removeRoute);
}