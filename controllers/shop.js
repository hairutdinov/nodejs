const adminData = require("../routes/admin");
const Product = require('../models/product')
const Order = require('../models/order')

exports.getIndex = async (req, res) => {
    Product.find()
        .then(products => {
            res.render('shop/index', { products, title: 'Shop', path: '/', isAuthenticated: req.session.isLoggedIn })
        })
        .catch(console.error)
}

exports.getProducts = async (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/products', { products, title: 'Products', path: '/products', isAuthenticated: req.session.isLoggedIn })

        })
        .catch(console.error)
}

exports.getProductDetail = async (req, res, next) => {
    const { id } = req.params
    Product.findById(id)
        .then(product => {
            res.render('shop/product-detail', { title: `Product Detail | ${ product.title }`, path: '/product-detail', product, isAuthenticated: req.session.isLoggedIn })
        })
        .catch(console.error)
}

exports.getCart = async (req, res, next) => {
    req.session.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then(user => {
            res.render('shop/cart', { title: 'Cart', path: '/cart', products:user.cart.items, isAuthenticated: req.session.isLoggedIn })
        })
        .catch(console.error)
}

exports.postCart = async (req, res, next) => {
    const { id } = req.body
    Product.findById(id)
        .then(product => {
            return req.session.user.addToCart(product)
        })
        .then(result => {
            res.redirect('/cart')
        })
}

exports.getOrders = async (req, res, next) => {
    Order.find({ 'user.id': req.session.user._id })
        .then(orders => {
            res.render('shop/orders', { title: 'Orders', path: '/orders', orders, isAuthenticated: req.session.isLoggedIn })
        })
        .catch(console.error)
}

exports.getCheckout = async (req, res, next) => {
    res.render('shop/checkout', { title: 'Checkout', path: '/checkout', isAuthenticated: req.session.isLoggedIn })
}

exports.postCartDelete = async (req, res) => {
    const { id } = req.body
    req.session.user.removeFromCart(id)
        .then(() => {
            res.redirect('/cart')
        })
        .catch(e => {
            console.error(e)
            res.redirect('/cart')
        })
}

exports.postCreateOrder = async (req, res) => {
    const { id } = req.body
    const products = req.session.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => ({
                quantity: i.quantity,
                product: {
                    ...i.productId._doc
                },
            }))

            const order = new Order({
                user: {
                    name: req.session.user.name,
                    id: req.session.user._id
                },
                products
            })

            return order.save()
        })
        .then(() => {
            return req.session.user.clearCart()
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(console.error)
}