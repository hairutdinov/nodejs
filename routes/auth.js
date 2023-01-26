const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { body } = require('express-validator')

router.get('/login', authController.getLogin)

router.post('/login', authController.postLogin)

router.get('/signup', authController.getSignup)

router.post('/signup', body('email').isEmail().withMessage('Please enter a valid email'), authController.postSignup)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router