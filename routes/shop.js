const path = require('path')
const rootDir = require('../helpers/path')
const express = require('express')
const router = express.Router()

const adminData = require('./admin')

router.get('/', (req, res, next) => {
    console.log('shop.js', adminData.products)
    res.sendFile(path.join(rootDir, 'views', 'shop.html'))
})

module.exports = router