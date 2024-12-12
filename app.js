const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./db');
const routes = require('./routes')
require('dotenv').config();

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// db.testConnection();
let isLoggedIn = false;
routes(app); 


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    if (!isLoggedIn) {
        res.sendFile(path.join(__dirname, 'public', 'login_create.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    }
});

app.get('/submit_book', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submit.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length == 0) {
            return res.send(`
                <script>
                    alert('Email user not found!');
                    window.location.href = '/';
                </script>
                `)
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send(`
                <script>
                    alert('Wrong password!');
                    window.location.href = '/';
                </script>
                `)
        }

        req.session.isLoggedIn = true;
        req.session.username = user.username;
        req.session.user_id = user.id;
        isLoggedIn = true;

        return res.redirect('/');
    } catch (err) {
        console.error('Error:', err);
        return res.sendStatus(500);
    }
});

app.post('/create', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const result = await db.query('SELECT email FROM users where email = $1', [email]);
        if (result.rows.length > 0) {
            res.send(`
                <script>
                    alert('Email already in use!');
                    window.location.href = '/';
                </script>`);
        }

        const password_hashed = await hashPassword(password);
        await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password_hashed]);
        res.send(`
            <script>
                alert('Account Succesfully Created. Please Log in');
                window.location.href = '/';
            </script>
            `)
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send(`
            <script>
                alert('An error occurred during account creation.');
                window.location.href = '/';
            </script>
        `);
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

async function hashPassword(password) {
    try {
        const password_hashed = await bcrypt.hash(password, saltRounds);
        return password_hashed;
    } catch (error) {
        throw err;
    }
};

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    db.testConnection(); 
});