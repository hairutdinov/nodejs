const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/cart', isAuth, shopController.getCart)

router.post('/cart', isAuth, shopController.postCart)

router.get('/orders', isAuth, shopController.getOrders)

router.get('/products/:id', shopController.getProductDetail)

router.post('/cart/delete', isAuth, shopController.postCartDelete)

router.post('/order/create', isAuth, shopController.postCreateOrder)

router.get('/orders/:orderId', isAuth, shopController.getInvoice)

module.exports = router