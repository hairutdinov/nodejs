const adminData = require("../routes/admin");
const Product = require('../models/product')
const Order = require('../models/order')
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const ITEMS_PER_PAGE = 1

exports.getIndex = async (req, res) => {
    const page = +req.query.page || 1
    let totalItems
    Product.find()
        .countDocuments()
        .then(count => {
            totalItems = count
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                products,
                title: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            })
        })
        .catch(e => {
            console.error(e)
            const error = new Error(e)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getProducts = async (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/products', { products, title: 'Products', path: '/products' })

        })
        .catch(e => {
            console.error(e)
            const error = new Error(e)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getProductDetail = async (req, res, next) => {
    const { id } = req.params
    Product.findById(id)
        .then(product => {
            res.render('shop/product-detail', { title: `Product Detail | ${ product.title }`, path: '/product-detail', product })
        })
        .catch(e => {
            console.error(e)
            const error = new Error(e)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getCart = async (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then(user => {
            res.render('shop/cart', { title: 'Cart', path: '/cart', products:user.cart.items })
        })
        .catch(e => {
            console.error(e)
            const error = new Error(e)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postCart = async (req, res, next) => {
    const { id } = req.body
    Product.findById(id)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            res.redirect('/cart')
        })
}

exports.getOrders = async (req, res, next) => {
    Order.find({ 'user.id': req.user._id })
        .then(orders => {
            res.render('shop/orders', { title: 'Orders', path: '/orders', orders })
        })
        .catch(e => {
            console.error(e)
            const error = new Error(e)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getCheckout = async (req, res, next) => {
    res.render('shop/checkout', { title: 'Checkout', path: '/checkout' })
}

exports.postCartDelete = async (req, res) => {
    const { id } = req.body
    req.user.removeFromCart(id)
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
    const products = req.user
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
                    email: req.user.email,
                    id: req.user._id
                },
                products
            })

            return order.save()
        })
        .then(() => {
            return req.user.clearCart()
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(e => {
            console.error(e)
            const error = new Error(e)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getInvoice = (req, res, next) => {
    const { orderId } = req.params
    Order.findById(orderId)
        .then(o => {
            if (!o) return next(new Error('No order found'))
            if (o.user.id.toString() !== req.user._id.toString()) return next(new Error('Unauthorized'))

            const invoiceName = `invoice-${ orderId }.pdf`
            const invoicePath = path.join('data', 'invoices', invoiceName)
            const pdfDoc = new PDFDocument()
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename="${ invoiceName }"`)
            pdfDoc.pipe(fs.createWriteStream(invoicePath))
            pdfDoc.pipe(res)
            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            })
            pdfDoc.text('------------------------')
            let totalPrice = 0
            o.products.forEach(p => {
                pdfDoc.fontSize(14).text(`${ p.product.title } - ${ p.quantity } x $${ p.product.price }`)
                totalPrice += p.quantity * p.product.price
            })
            pdfDoc.text('------------------------')
            pdfDoc.fontSize(20).text(`Total price: $${totalPrice}`)

            pdfDoc.end()

        })
        .catch(e => next(e))
}