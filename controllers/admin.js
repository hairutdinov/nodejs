const Product = require('../models/product')

exports.getEditProduct = async (req, res) => {
    const id = req.params?.id ? req.params.id : ''
    if (id) {
        Product.findById(id)
            .then(product => {
                if (!product) return res.redirect('/admin/product-list')
                res.render('admin/edit-product', { title: 'Add Product', path: '/admin/add-product', product, id, isAuthenticated: req.session.isLoggedIn })
            })
            .catch(err => console.error(err))
    } else {
        res.render('admin/edit-product', { title: 'Add Product', path: '/admin/add-product', id, isAuthenticated: req.session.isLoggedIn })
    }
}

exports.postEditProduct = async (req, res) => {
    try {
        const id = req.body?.id ? req.body.id : ''
        const { title, price, description, imageUrl } = req.body

        if (id) {
            Product.findById(id)
                .then(p => {
                    p.title = title
                    p.price = price
                    p.description = description
                    p.imageUrl = imageUrl
                    return p.save()
                })
                .then(r => {
                    res.redirect(`/admin/product-list`)
                })
                .catch(console.error)
        } else {
            const product = new Product({ title, price, description, imageUrl, userId: req.session.user })
            product.save()
                .then(r => {
                    res.redirect(`/admin/product-list`)
                })
                .catch(console.error)
        }
    } catch (e) {
        console.error(e)
        res.redirect(`/admin/product-list`)
    }
}

exports.getProductList = async (req, res) => {
    Product.find()
        .populate('userId')
        .then(products => {
            res.render('admin/product-list', { products, title: 'Admin Products', path: '/admin/product-list', isAuthenticated: req.session.isLoggedIn })
        })
        .catch(console.error)
}
//
exports.postDeleteProduct = async (req, res) => {
    try {
        const id = req.body?.id ? req.body.id : ''
        Product.findByIdAndRemove(id).then(() => {
            res.redirect(`/admin/product-list`)
        })
    } catch (e) {
        console.error(e)
        res.redirect(`/admin/product-list`)
    }
}