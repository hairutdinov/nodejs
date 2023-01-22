const adminData = require("../routes/admin");
const Product = require('../models/product')

exports.getIndex = async (req, res) => {
    res.render('shop/index', { products: await Product.fetchAll(), title: 'Shop', path: '/' })
}

exports.getProducts = async (req, res, next) => {
    res.render('shop/products', { products: await Product.fetchAll(), title: 'Products', path: '/products' })
}

exports.getProductDetail = async (req, res, next) => {
    const { productId } = req.params
    const product = await Product.findByProductId(productId)
    res.render('shop/product-detail', { title: 'Product Detail', path: '/product-detail', product, productId })
}

exports.getCart = async (req, res, next) => {
    res.render('shop/cart', { title: 'Cart', path: '/cart' })
}

exports.postCart = async (req, res, next) => {
    const { productId } = req.body
    console.log(productId)
    res.redirect('/cart')
}

exports.getOrders = async (req, res, next) => {
    res.render('shop/orders', { title: 'Orders', path: '/orders' })
}

exports.getCheckout = async (req, res, next) => {
    res.render('shop/checkout', { title: 'Checkout', path: '/checkout' })
}