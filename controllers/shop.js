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
    req.user.getCart()
        .then(cart => {
            if (!cart) {
                return res.render('shop/cart', { title: 'Cart', path: '/cart', products: [] })
            }
            return cart.getProducts()
                .then(products => {
                    console.log(products)
                    res.render('shop/cart', { title: 'Cart', path: '/cart', products })
                })
                .catch(console.error)
        })
        .catch(console.error)
}

exports.postCart = async (req, res, next) => {
    const { id } = req.body
    let cart,
        quantity = 1
    req.user.getCart()
        .then(c => {
            if (!c) return []
            cart = c
            return c.getProducts({ where: { id } })
        })
        .then(products => {
            let product
            if (products.length > 0) {
                product = products[0]
                quantity = product.cartItem.quantity + 1
                return product
            }

            return Product.findByPk(id)
                .then(product => product)
                .catch(console.error)
        })
        .then(product => {
            return cart.addProduct(product, { through: { quantity } })
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(console.error)
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