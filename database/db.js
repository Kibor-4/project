require('dotenv').config();
const mysql = require('mysql2/promise');

let pool;

async function createTables(pool) {
    const conn = await pool.getConnection();
    try {
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS Users (
                Id INT AUTO_INCREMENT PRIMARY KEY,
                Username VARCHAR(255) NOT NULL UNIQUE,
                EMAIL VARCHAR(255) NOT NULL UNIQUE,
                Date_of_Birth DATE,
                Password VARCHAR(255) NOT NULL
            )
        `);
        console.log('Users table created or verified.');

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS Properties (
                id INT AUTO_INCREMENT PRIMARY KEY,
                location VARCHAR(255) NOT NULL,
                house_type VARCHAR(50) NOT NULL,
                sqft INT NOT NULL,
                bedrooms INT NOT NULL,
                bathrooms INT NOT NULL,
                lot_size INT,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                images TEXT -- Store image paths as JSON array
            )
        `);
        console.log('Properties table created or verified.');
    } finally {
        conn.release();
    }
}

async function connectToDatabase() {
    try {
        if (!pool) {
            const dbName = process.env.DB_NAME;

            pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                connectionLimit: 10,
                waitForConnections: true,
                queueLimit: 0,
            });

            console.log('Database pool created successfully');

            const conn = await pool.getConnection();
            try {
                await conn.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
                await conn.query(`USE ${dbName}`);
                console.log(`Database ${dbName} created or verified.`);
            } finally {
                conn.release();
            }
            await createTables(pool);
        }
        return pool;
    } catch (err) {
        console.error('Database connection or creation error:', err);
        throw err;
    }
}

module.exports = (async () => {
    return await connectToDatabase();
})();