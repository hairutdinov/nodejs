const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/auth/login',
        title: 'Login',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken()
    })
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body

    User.findOne({ email })
        .then(user => {
            if (!user) return res.redirect('/login')
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) return res.redirect('/login')
                    req.session.isLoggedIn = true
                    req.session.user = user
                    req.session.save(e => {
                        if (e) console.error(e)
                        res.redirect('/')
                    })
                })
                .catch(console.error)
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