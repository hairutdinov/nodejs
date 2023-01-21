const adminData = require("../routes/admin");
const Product = require('../models/product')

exports.actionGetAddProduct = (req, res) => {
    res.render('add-product', { title: 'Add Product', path: '/admin/add-product' })
}

exports.actionPostAddProduct = (req, res) => {
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}

exports.actionGetProducts = async (req, res, next) => {
    // uses default templating engine, which we defined in server.js
    res.render('shop', { products: await Product.fetchAll(), title: 'Shop', path: '/' })
}

// exports.products = products