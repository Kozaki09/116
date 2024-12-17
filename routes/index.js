const addRoute = require('./add');
const getRoute = require('./get');
const editRoute = require('./edit')
const authRoute = require('./auth');
const removeRoute = require('./remove');

module.exports = (app) => {
    app.use('/add', addRoute);
    app.use('/get', getRoute);
    app.use('/edit', editRoute);
    app.use('/auth', authRoute);
    app.use('/remove', removeRoute);
}