const express = require('express');
const router = express.Router();
const db = require('../db/index');
const { hashPassword, comparePassword } = require('../utils/helpers');
const { findByEmail, createUser } = require('../utils/dbHelpers');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const results = await findByEmail(email);
        if (results.rows.length == 0) {
            return res.send(`
                <script>
                    alert('Email user not found!');
                    window.location.href = '/';
                </script>
                `)
        }

        const user = results.rows[0];
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.send(`
                <script>
                    alert('Wrong password!');
                    window.location.href = '/';
                </script>
                `)
        }

        req.session.isLoggedIn = true;
        req.session.user_id = user.id;
        req.session.user_name = user.username;
        req.session.user_email = user.email;
        req.session.isAdmin = user.isAdmin;

        return res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        return res.sendStatus(500);
    }
});

router.post('/create', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const results = await findByEmail(email);
        if (results.rows.length > 0) {
            return res.send(`
                <script>
                    alert('Email aready in use!');
                    window.location.href = '/';
                </script>
                `)
        }

        const hash = await hashPassword(password);
        await createUser(username, email, hash);
        return res.send(`
            <script>
                alert('Account Succesfully Created. Please Log in');
                window.location.href = '/';
            </script>
            `)
    } catch (err) {
        console.error('Error: ', err);
        return res.status(500).send(`
            <script>
                alert('An error occurred during account creation.');
                window.location.href = '/';
            </script>
        `);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log('Error destroying session: ', error);
            return res.sendStatus(500);
        }

        req.session.isLoggedIn = false;
        req.session.user_id = null;
        req.session.user_name = null;
        req.session.user_email = null;
        req.session.isAdmin = false;

        res.redirect('/');
    })
})

module.exports = router;