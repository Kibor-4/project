// saleRouter.js
const express = require('express');
const router = express.Router();
const getPool = require('../database/db');

// Route to fetch and render all properties
router.get('/all', async (req, res) => {
    try {
        const pool = await getPool;
        const [rows] = await pool.query('SELECT * FROM Properties'); // Fetch all properties

        const properties = rows.map(property => {
            return {
                ...property,
                images: JSON.parse(property.images) // Parse images for each property
            };
        });

        res.render('sale', { properties: properties }); // Pass 'properties' array
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).send('Server error');
    }
});

router.get('/property/:id', async (req, res) => {
    try {
        const pool = await getPool;
        const propertyId = req.params.id;

        const [propertyResult] = await pool.query(`
            SELECT p.*, u.name AS contactName, u.email AS contactEmail, u.phone AS contactPhone
            FROM Properties p
            JOIN Users u ON p.user_id = u.id -- Assuming you have a user_id column in Properties
            WHERE p.id = ?
        `, [propertyId]);

        if (propertyResult.length === 0) {
            return res.status(404).send('Property not found');
        }

        const property = propertyResult[0];
        property.images = JSON.parse(property.images || '[]');

        res.render('property-details', { property: property });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;