const isAuthenticated = (req, res, next) => {
    console.log('Session in isAuthenticated middleware:', req.session);
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

module.exports = isAuthenticated;