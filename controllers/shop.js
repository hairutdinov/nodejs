const adminData = require("../routes/admin");
const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = async (req, res) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', { products, title: 'Shop', path: '/' })
        })
        .catch(console.error)
}

exports.getProducts = async (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/products', { products, title: 'Products', path: '/products' })

        })
        .catch(console.error)
}

exports.getProductDetail = async (req, res, next) => {
    const { id } = req.params
    Product.findByPk(id)
        .then(product => {
            res.render('shop/product-detail', { title: `Product Detail | ${ product.title }`, path: '/product-detail', product })
        })
        .catch(console.error)
}

exports.getCart = async (req, res, next) => {
    res.render('shop/cart', { title: 'Cart', path: '/cart', cart: await Cart.getCartWithProducts() })
}

exports.postCart = async (req, res, next) => {
    const { productId } = req.body
    const product = await Product.findByProductId(productId)
    product.id = productId
    await Cart.addProduct(product)
    res.redirect('/cart')
}

exports.getOrders = async (req, res, next) => {
    res.render('shop/orders', { title: 'Orders', path: '/orders' })
}

exports.getCheckout = async (req, res, next) => {
    res.render('shop/checkout', { title: 'Checkout', path: '/checkout' })
}

exports.postCartDelete = async (req, res) => {
    const { id } = req.body
    const product = await Product.findByProductId(id)
    await Cart.deleteProduct(product)
    res.redirect('/cart')
}