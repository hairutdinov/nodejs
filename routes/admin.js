const path = require('path')
const rootDir = require('../helpers/path')
const express = require('express')
const router = express.Router()

const products = []

// GET /admin/add-post
router.get('/add-product', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

// POST /admin/add-post
router.post('/add-product', (req, res) => {
    products.push({ title: req.body.title })
    res.redirect('/')
})

exports.routes = router
exports.products = products