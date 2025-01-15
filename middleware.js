// middleware.js

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // Save the requested URL
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo; // Transfer `returnTo` to res.locals
    }
    next();
};
