const express = require('express');
const session = require('express-session');
require('dotenv').config();
const { serveStatic, resolvePath, getSession, formatBookResults } = require('./utils/helpers');

const db = require('./db/index');
const routes = require('./routes/index');
const { isAuthenticated } = require('./middleware/auth');
const { buildBookQuery } = require('./middleware/query-builders');

const app = express();  
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use('/css', serveStatic('views/css'));
app.use('/partial', serveStatic('views/partial'));

routes(app); 

app.set('view engine', 'ejs');
app.set('views', resolvePath('views'));

app.get('/', isAuthenticated, async (req, res) => {
    const user = getSession(req);

    filters = {user_id: user.id};
    const results = await buildBookQuery(filters);
    const books = formatBookResults(results);

    if (user.isAdmin) {
        return sendHtmlFile(res, 'private/dashboard.html');
    } 
        
    return res.render('public/dashboard', { 
        books: books, 
        user: user 
    });
        // return sendHtmlFile(res, 'public/dashboard.html');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    db.testConnection();
})

