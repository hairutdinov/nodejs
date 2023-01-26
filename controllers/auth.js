const User = require('../models/user')
const bcrypt = require('bcryptjs')

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

exports.getSignup = (req, res, next) => {
    res.render('auth/signup')
}

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body
    User.findOne({ email })
        .then(u => {
            if (u) return res.redirect('/signup')
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        cart: { items: [] }
                    })
                    return user.save()
                })
                .then(() => {
                    res.redirect('/login')
                })
        })
        .catch(console.error)
}