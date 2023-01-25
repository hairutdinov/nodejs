const adminData = require("../routes/admin");
const Product = require('../models/product')

exports.getIndex = async (req, res) => {
    Product.find()
        .then(products => {
            res.render('shop/index', { products, title: 'Shop', path: '/' })
        })
        .catch(console.error)
}

exports.getProducts = async (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/products', { products, title: 'Products', path: '/products' })

        })
        .catch(console.error)
}

exports.getProductDetail = async (req, res, next) => {
    const { id } = req.params
    Product.findById(id)
        .then(product => {
            res.render('shop/product-detail', { title: `Product Detail | ${ product.title }`, path: '/product-detail', product })
        })
        .catch(console.error)
}

exports.getCart = async (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then(user => {
            res.render('shop/cart', { title: 'Cart', path: '/cart', products:user.cart.items })
        })
        .catch(console.error)
}

exports.postCart = async (req, res, next) => {
    const { id } = req.body
    Product.findById(id)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            console.log(result)
            res.redirect('/cart')
        })
}

exports.getOrders = async (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', { title: 'Orders', path: '/orders', orders })
        })
        .catch(console.error)
}

exports.getCheckout = async (req, res, next) => {
    res.render('shop/checkout', { title: 'Checkout', path: '/checkout' })
}

exports.postCartDelete = async (req, res) => {
    const { id } = req.body
    req.user.deleteItemFromCart(id)
        .then(() => {
            res.redirect('/cart')
        })
        .catch(console.error)
    res.redirect('/cart')
}

exports.postCreateOrder = async (req, res) => {
    req.user.addOrder()
        .then(() => {
            res.redirect('/orders')
        })
        .catch(console.error)
}