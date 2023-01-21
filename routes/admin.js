const path = require('path')
const express = require('express')
const router = express.Router()
const productsController = require('../controllers/products')

router.get('/add-product', productsController.actionGetAddProduct)

router.post('/add-product', productsController.actionPostAddProduct)

module.exports = router