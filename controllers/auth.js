const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/auth/login',
        title: 'Login',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postLogin = (req, res, next) => {
    User.findById(process.env.MONGO_USER_ID)
        .then(user => {
            req.session.isLoggedIn = true
            req.session.user = user
            req.session.save(e => {
                console.error(e)
                res.redirect('/')
            })
        })
        .catch(console.error)
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}
