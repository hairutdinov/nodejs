const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', { title: 'Add Product', path: '/admin/add-product' })
}

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}

exports.getProductList = async (req, res) => {
    res.render('admin/product-list', { products: await Product.fetchAll(), title: 'Admin Products', path: '/admin/product-list' })
}