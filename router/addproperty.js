const express = require('express');
const router = express.Router();
const path = require('path');
const getPool = require('../database/db');
const upload = require('../Public/Uploads/multer'); // Import the upload middleware
require('dotenv').config();

// Route to handle property submissions
router.post('/submit', upload.array('images', 5), async (req, res) => {
    try {
        const { location, house_type, sqft, bedrooms, bathrooms, lot_size, price, description } = req.body;
        const images = req.files.map(file => '/Public/Uploads/uploads/' + file.filename); // Corrected line

        const pool = await getPool;
        await pool.query(
            'INSERT INTO Properties (location, house_type, sqft, bedrooms, bathrooms, lot_size, price, description, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [location, house_type, sqft, bedrooms, bathrooms, lot_size, price, description, JSON.stringify(images)]
        );

        res.send('Property added successfully!');
    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).send('Error adding property.');
    }
});

module.exports = router;