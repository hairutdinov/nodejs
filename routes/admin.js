const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

router.get('/add-product', isAuth, adminController.getEditProduct)

router.post('/add-product', isAuth, adminController.postEditProduct)

router.get('/edit-product/:id', isAuth, adminController.getEditProduct)

router.post('/edit-product/:id', isAuth, adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

router.get('/product-list', isAuth, adminController.getProductList)

module.exports = router