const path = require('path')
const rootDir = require('../helpers/path')
const express = require('express')
const router = express.Router()

const adminData = require('./admin')

router.get('/', (req, res, next) => {
    const products = adminData.products
    // uses default templating engine, which we defined in server.js
    res.render('shop', { products, title: 'Shop' })
})

module.exports = router