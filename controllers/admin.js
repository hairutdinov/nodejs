const Product = require('../models/product')

exports.getEditProduct = async (req, res) => {
    const id = req.params?.id ? req.params.id : ''
    let product

    if (id) {
        product = await Product.findByProductId(id).catch(err => console.error(err))
        if (!product) return res.redirect(`/products`)
    } else {
        product = new Product()
    }

    res.render('admin/edit-product', { title: 'Add Product', path: '/admin/add-product', product })
}

exports.postEditProduct = async (req, res) => {
    const id = req.body?.id ? req.body.id : ''

    let product

    if (id) {
        product = await Product.findByProductId(id)
    } else {
        product = new Product()
    }

    product.load(req.body)

    product.save()

    if (id) {
        res.redirect(`/admin/edit-product/${ id }`)
    } else {
        res.redirect(`/admin/add-product`)
    }
}

exports.getProductList = async (req, res) => {
    res.render('admin/product-list', { products: await Product.fetchAll(), title: 'Admin Products', path: '/admin/product-list' })
}