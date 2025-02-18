// saleRouter.js
const express = require('express');
const router = express.Router();
const getPool = require('../database/db');

router.get('/:id', async (req, res) => {
    try {
        const propertyId = req.params.id;
        const pool = await getPool;
        const [rows] = await pool.query('SELECT * FROM Properties WHERE id = ?', [propertyId]);

        if (rows.length > 0) {
            const property = rows[0];
            const images = JSON.parse(property.images); // Parse the JSON string

            res.render('sale', {
                location: property.location,
                house_type: property.house_type,
                sqft: property.sqft,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                lot_size: property.lot_size,
                price: property.price,
                description: property.description,
                images: images
            });
        } else {
            res.status(404).send('Property not found');
        }
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;