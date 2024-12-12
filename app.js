const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./db');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

db.testConnection();


let isLoggedIn = false; 

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    if (!isLoggedIn) {
        res.sendFile(path.join(__dirname, 'public', 'login_create.html'));
    } else {
        res.sendFile(path.join(_dirname, 'public', 'dashboard.html'));
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            const user = results.results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                req.session.isLoggedIn = true;
                req.session.username = await db.query('SELECT username FROM users WHERE email = $1', [email])
                isLoggedIn = true;

                res.redirect('/');
            } else {
                //
            } 
        } else {
            // alert(email not registered not found)
        }
    } catch (err) {
        console.error('Error: err');
        res.sendStatus(500);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.sendStatus(500);
        }
        isLoggedIn = false;
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});