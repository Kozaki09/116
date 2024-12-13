const db = require('./db/index');
const express = require('express');
const session = require('express-session');
const { isAuthenticated } = require('./middleware/auth'); 
const { serveStaticFiles, sendHtmlFile } = require('./utils/helpers');
require('dotenv').config();

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './html/views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const routes = require('./routes/index');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

routes(app); 

app.use('/css', serveStaticFiles('html/css'));
app.use('/public', serveStaticFiles('html/public'));
app.use('/private', serveStaticFiles('html/private'));
// app.use('/css', express.static(path.join(__dirname, 'html/css')));
// app.use('/public', express.static(path.join(__dirname, 'html/public')));
// app.use('/private', express.static(path.join(__dirname, 'html/private')));

app.get('/', isAuthenticated, (req, res) => {
    if (req.session.isAdmin) {
        return sendHtmlFile(res, 'private/dashboard.html');
    } else {
        return sendHtmlFile(res, 'public/dashboard.html');
    }
});

app.get('/submit_book', isAuthenticated, (req, res) => {
    return sendHtmlFile(res, 'public/submit.html');
}); 

app.get('/browse', isAuthenticated, (req, res) => {
    return sendHtmlFile(res, 'public/browse.html')
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    db.testConnection(); 
});