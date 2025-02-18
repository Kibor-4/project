// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const getPool = require('./database/db');
const routes = require('./router/routes');
const userRoutes = require('./router/signup');
const loginRouter = require('./router/auth');
const addPropertyRouter = require('./router/addproperty');
const saleRouter = require('./router/salerouter');


const app = express();

// CORS configuration (if needed)
// app.use(cors());

// Session middleware (place before other middleware and routes)
app.use(session({
    secret: 'your_secret_key', // Replace with a strong, random secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mount routes
app.use('/', routes);
app.use('/signup', userRoutes); // Corrected signup path
app.use('/login', loginRouter);
app.use('/add-property', addPropertyRouter);
app.use('/sale', saleRouter); 

// Static files
app.use('/Public', express.static(path.join(__dirname, 'Public')));



// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Logout failed');
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});

// Start server
async function startServer() {
    try {
        const pool = await getPool;
        console.log('Database connected successfully');

        const port = process.env.PORT || 8100;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    }
}

startServer();