const adminData = require("../routes/admin");
const Product = require('../models/product')

exports.getIndex = async (req, res) => {
    res.render('shop/index', { products: await Product.fetchAll(), title: 'Shop', path: '/' })
}

exports.getProducts = async (req, res, next) => {
    res.render('shop/products', { products: await Product.fetchAll(), title: 'Products', path: '/products' })
}

exports.getCart = async (req, res, next) => {
    res.render('shop/cart', { title: 'Cart', path: '/cart' })
}

exports.getCheckout = async (req, res, next) => {
    res.render('shop/checkout', { title: 'Checkout', path: '/checkout' })
}