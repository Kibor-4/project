const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const getPool = require('../database/db');

router.post('/', async (req, res) => {
    console.log('POST /login route hit');
    const { username, password } = req.body;

    try {
        const pool = await getPool;
        const [rows] = await pool.query('SELECT * FROM Users WHERE Username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).render('login', { error: 'User does not exist.' }); // Specific error message
        }

        const user = rows[0];

        console.log("Plain Password:", password);
        console.log("Hashed Password from DB:", user.Password);

        if (!user.Password) {
            return res.status(500).render('login', { error: "Database error, user password not found." });
        }

        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            return res.status(401).render('login', { error: 'Incorrect password.' }); // Specific error message
        }

        req.session.user = user;
        res.redirect('/dashboard'); // Redirect to dashboard on success

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;