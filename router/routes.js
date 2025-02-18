const express = require('express');
const router = express.Router();
const isAuthenticated = require('./authmiddleware'); // Import the middleware (adjust path if needed)

router.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

router.get('/home', (req, res) => {
    res.render('home', { title: 'Home' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

router.get('/valuate', (req, res) => {
    res.render('valuate', { title: 'Valuate' });
});

router.get('/add-property', (req, res) => {
    res.render('addproperty', { title: 'Add Property' });
});

router.get('/sell', (req, res) => {
    res.render('sell', { title: 'Sell' });
});

router.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin' });
});

// Removed incorrect line
// router.get('/sale', (req, res) => {
//     res.render('sale', { title: 'sale' });
// });

// Protected routes
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

router.get('/admin-dashboard', isAuthenticated, (req, res) => {
    res.render('admin-dashboard', { title: 'Admin Dashboard' });
});

module.exports = router;