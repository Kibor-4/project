const express = require('express');
const router = express.Router();
const isAuthenticated = require('./authmiddleware');
const getPool = require('../database/db'); // Import getPool

router.get('/dashboard', isAuthenticated, async (req, res) => {
    console.log('Session in /admin/dashboard:', req.session);

    // Check if the user is authenticated
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const pool = await getPool;

        // Query 1: Recent Properties with Image Handling
        const [Properties] = await pool.query(`
            SELECT * FROM Properties
            ORDER BY created_at DESC
            LIMIT 3;
        `);

        // Process images: Parse JSON and get first image URL
        const recentListings = Properties.map(listing => {
            let imageArray = JSON.parse(listing.images || '[]');
            let imageUrl = imageArray.length > 0 ? imageArray[0] : '/Public/images/placeholder.jpg';
            return {
                ...listing,
                imageUrl: imageUrl, // Add imageUrl property to the listing object
            };
        });

        console.log("Recent Properties with Image URLs:", recentListings);

        // Query 2: Total Properties
        const [totalProps] = await pool.query(`SELECT COUNT(*) AS total FROM Properties`);
        const totalProperties = totalProps[0].total;
        console.log("Total Properties:", totalProperties);

        // Query 3: Active Listings
        const [activeListingsResult] = await pool.query(`SELECT COUNT(*) AS active FROM Properties`);
        const activeListings = activeListingsResult[0].active;
        console.log("Active Listings:", activeListings);

        // Query 4: Total Users
        const [totalUsersResult] = await pool.query(`SELECT COUNT(*) AS total FROM Users`);
        const totalUsers = totalUsersResult[0].total;
        console.log("Total Users:", totalUsers);

        // Query 5: Revenue
        const [revenueResult] = await pool.query(`SELECT SUM(Price) AS totalRevenue FROM Properties`);
        const revenue = revenueResult[0].totalRevenue || 0;
        console.log("Revenue:", revenue);

        // Render the dashboard template with the data
        res.render('dashboard', {
            title: 'Dashboard',
            recentListings: recentListings, // Pass the processed listings
            totalProperties: totalProperties,
            activeListings: activeListings,
            totalUsers: totalUsers,
            revenue: revenue,
            user: req.session.user, // Pass the user session data
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;