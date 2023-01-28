const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

router.get('/add-product', isAuth, adminController.getAddProduct)

router.post('/add-product', isAuth, adminController.postAddProduct)

router.get('/edit-product/:id', isAuth, adminController.getEditProduct)

router.post('/edit-product/:id', isAuth, adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

router.delete('/product/:id', isAuth, adminController.deleteProduct)

router.get('/product-list', isAuth, adminController.getProductList)

module.exports = router