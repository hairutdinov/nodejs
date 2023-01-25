const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shop')

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/cart', shopController.getCart)

router.post('/cart', shopController.postCart)

// router.get('/orders', shopController.getOrders)

router.get('/products/:id', shopController.getProductDetail)

router.post('/cart/delete', shopController.postCartDelete)
//
// router.post('/order/create', shopController.postCreateOrder)

module.exports = router