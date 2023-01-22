const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')

router.get('/add-product', adminController.getEditProduct)

router.post('/add-product', adminController.postEditProduct)

router.get('/edit-product/:id', adminController.getEditProduct)

router.post('/edit-product/:id', adminController.postEditProduct)

router.get('/product-list', adminController.getProductList)

module.exports = router