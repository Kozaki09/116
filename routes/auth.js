const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword } = require('../utils/helpers');
const {  buildSearchQuery, buildInsertQuery } = require('../middleware/query-builders');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const results = await buildSearchQuery("users", [], {email: email});
        if (results.rowCount === 0) {
            return res.send(`
                <script>
                    alert('Email user not found!');
                    window.location.href = '/';   
                </script>
            `);
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
        req.session.user_email = user.user_email;
        req.session.isAdmind = user.isAdmin;

        return res.redirect('/');
    } catch (error) {
        console.error('Error: ', error);
        return res.sendStatus(500);
    }
})

router.post('/create', async (req, res) => {
    const { username, email, password } = req.body;
    const insert = {
        email: email,
        username: username,
        password: await hashPassword(password)
    };

    try {
        const email_check = await buildSearchQuery("users", [], {email: email});
        if (email_check.rowCount > 0) {
            return res.send(`
                <script>
                    alert ('Email already in use!');
                    window.location.href = '/';
                </script>    
            `)
        }

        const results = await buildInsertQuery("users", insert);
        if (results.rowCount > 0) {
            return res.send(`
                <script>
                    alert('Account Succesfully Created. Please Log in.');
                    window.location.href = '/';
                </script>    
            `)
        } else {
            throw new Error('No user row created.');
        }
    } catch (error) {
        console.log('Error trying to create new account: ', error);
        return res.sendStatus(500);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log('Error destroying session: ', error);
            return res.sendStatus(500);
        }

        res.redirect('/');
    })
})

module.exports = router;