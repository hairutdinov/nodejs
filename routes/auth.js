const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { body } = require('express-validator')
const User = require('../models/user')

router.get('/login', authController.getLogin)

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail(),
        body(
        'password',
            'Please enter a password with only numbers and text and at least 5 chars'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin
)

router.get('/signup', authController.getSignup)

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                return User
                    .findOne({ email: value })
                    .then(u => {
                        if (u) return Promise.reject('E-mail exists already, please pick a different one.')
                    })
            })
            .normalizeEmail(),
        body(
            'password',
            'Please enter a password with only numbers and text and at least 5 chars' // default error msg for all validators
        )
            .trim()
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!')
                }
                return true
            })
    ],
    authController.postSignup
)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router