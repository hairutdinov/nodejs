const crypto = require('crypto')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator')

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: process.env.SEND_GRID_MAILER_API_KEY,
    }
}))

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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/auth/login',
            title: 'Signup',
            errorMessage: errors.array()[0].msg
        })
    }

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
    res.render('auth/signup', {
        path: '/auth/signup',
        title: 'Signup',
    })
}

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/auth/signup',
            title: 'Signup',
            errorMessage: errors.array()[0].msg
        })
    }
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
            return transporter.sendMail({
                to: email,
                from: 'bulatsemail@gmail.com',
                subject: 'Signup succeeded!',

                html: `<h1>You successfully signed up!</h1>`
            })
        })
        .catch(console.error)
}

exports.getReset = (req, res, next) => {
    let errorMessage = req.flash('error')
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0]
    } else {
        errorMessage = null
    }
    res.render('auth/reset', {
        path: '/auth/reset',
        title: 'Reset',
        errorMessage
    })
}

exports.postReset = (req, res, next) => {
    const { email } = req.body
    crypto.randomBytes(32, (e, buffer) => {
        if (e) {
            console.error(e)
            return res.redirect('/reset')
        }

        const token = buffer.toString('hex')

        User.findOne({ email })
            .then(u => {
                if (!u) {
                    req.flash('error', 'No account with that email found.')
                    return res.redirect('/reset')
                }
                const hourInMilliseconds = 60 * 60 * 1000
                u.resetToken = token
                u.resetTokenExpiration = Date.now() + hourInMilliseconds
                return u.save()
            })
            .then(() => {
                res.redirect('/')
                return transporter.sendMail({
                    to: email,
                    from: 'bulatsemail@gmail.com',
                    subject: 'Password reset',

                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:8101/reset/${ token }">link</a> to set a new password</p>
                    `
                })
            })
            .catch(console.error)
    })
}

exports.getNewPassword = (req, res, next) => {
    const { token } = req.params
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(u => {
            let errorMessage = req.flash('error')
            if (errorMessage.length > 0) {
                errorMessage = errorMessage[0]
            } else {
                errorMessage = null
            }

            if (!u) {
                req.flash('error', 'Invalid user token!')
                return res.redirect('/reset')
            }

            res.render('auth/new-password', {
                path: '/auth/new-password',
                title: 'Updating Password',
                errorMessage,
                userId: u._id.toString(),
                token,
            })

        })
        .catch(console.error)
}

exports.postNewPassword = (req, res, next) => {
    const { password, userId, token } = req.body

    User.findOne({ _id: userId, resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(u => {
            if (!u) {
                req.flash('error', 'Invalid user token.')
                return res.redirect('/reset')
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    u.password = hashedPassword
                    u.resetToken = u.resetTokenExpiration = undefined
                    return u.save()
                })
                .then(() => {
                    res.redirect('/login')
                })
        })
        .catch(console.error)
}
