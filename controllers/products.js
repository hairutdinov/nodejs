const adminData = require("../routes/admin");
const products = []

exports.actionGetAddProduct = (req, res) => {
    res.render('add-product', { title: 'Add Product', path: '/admin/add-product' })
}

exports.actionPostAddProduct = (req, res) => {
    products.push({ title: req.body.title })
    res.redirect('/')
}

exports.actionGetProducts = (req, res, next) => {
    // uses default templating engine, which we defined in server.js
    res.render('shop', { products, title: 'Shop', path: '/' })
}

// exports.products = products