const adminData = require("../routes/admin");
const Product = require('../models/product')

exports.getIndex = async (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', { products, title: 'Shop', path: '/' })
        })
        .catch(console.error)
}

exports.getProducts = async (req, res, next) => {
    Product.fetchAll()
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
    // req.user.getCart()
    //     .then(cart => {
    //         if (!cart) {
    //             return res.render('shop/cart', { title: 'Cart', path: '/cart', products: [] })
    //         }
    //         return cart.getProducts()
    //             .then(products => {
    //                 console.log(products)
    //                 res.render('shop/cart', { title: 'Cart', path: '/cart', products })
    //             })
    //             .catch(console.error)
    //     })
    //     .catch(console.error)
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
    /**
     *  why products?
     * because in server.js:61 we defined:
     * * Order.belongsToMany(Product, { through: OrderItem })
     * and if we look up at out product model (models/product.js), it has a name: product
     * and sequelize pluralizes this
     * ! eager loading concept
    * */
    req.user.getOrders({ include: ['products']})
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
    req.user.getCart()
        .then(c => {
            return c.getProducts({ where: { id } })
        })
        .then(products => {
            const product = products[0]
            return product.cartItem.destroy()
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(console.error)
    res.redirect('/cart')
}

exports.postCreateOrder = async (req, res) => {
    let cart
    req.user.getCart()
        .then(c => {
            cart = c
            return c.getProducts()
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(p => {
                        p.orderItem = { quantity: p.cartItem.quantity }
                        return p
                    }))
                })
                .catch(console.error)
        })
        .then(() => {
            return cart.setProducts(null)
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(console.error)
}