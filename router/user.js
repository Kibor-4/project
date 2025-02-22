const express = require('express');
const router = express.Router();
const isAuthenticated = require('./authmiddleware');
const getPool = require('../database/db');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/uploads/'); // Set the upload directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const pool = await getPool;
        const userId = req.session.userId;

        const [userResult] = await pool.query('SELECT * FROM Users WHERE id = ?', [userId]);
        console.log('User result:', userResult);

        if (!userResult[0]) {
            console.log('No user found with ID:', userId);
            return res.redirect('/login');
        }

        const user = {
            Username: userResult[0].Username,
            email: userResult[0].email,
            phone: userResult[0].phone,
            profile_picture: userResult[0].profile_picture
        };

        res.render('profile', { user: user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/profile', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        const pool = await getPool;
        const userId = req.session.userId;
        const { username, email, phone } = req.body;
        let profilePicturePath = req.file ? '/Public/uploads/' + req.file.filename : null;

        // If a new picture wasn't uploaded, keep the old one.
        if (!profilePicturePath) {
          const [oldPicture] = await pool.query('SELECT profile_picture FROM Users WHERE id = ?', [userId]);
          if (oldPicture[0] && oldPicture[0].profile_picture){
            profilePicturePath = oldPicture[0].profile_picture;
          }
        }

        await pool.query('UPDATE Users SET Username = ?, email = ?, phone = ?, profile_picture = ? WHERE id = ?', [username, email, phone, profilePicturePath, userId]);

        res.redirect('/profile'); // Redirect back to the profile page
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.post('/delete-account', isAuthenticated, async (req, res) => {
    try {
        const pool = await getPool;
        const userId = req.session.userId;

        await pool.query('DELETE FROM Users WHERE id = ?', [userId]);

        // Destroy the session and redirect to login
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/login');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;