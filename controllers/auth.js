const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    let errorMessage = req.flash('error')
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0]
    } else {
        errorMessage = null
    }
    res.render('auth/login', {
        path: '/auth/login',
        title: 'Login',
        errorMessage
    })
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body

    User.findOne({ email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.')
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        req.flash('error', 'Invalid email or password.')
                        return res.redirect('/login')
                    }
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