const Product = require('../models/product')

exports.getEditProduct = async (req, res) => {
    const id = req.params?.id ? req.params.id : ''
    if (id) {
        Product.findById(id)
            .then(product => {
                if (!product || product.userId.toString() !== req.user._id.toString()) return res.redirect('/admin/product-list')
                res.render('admin/edit-product', { title: 'Add Product', path: '/admin/add-product', product, id })
            })
            .catch(err => console.error(err))
    } else {
        res.render('admin/edit-product', { title: 'Add Product', path: '/admin/add-product', id })
    }
}

exports.postEditProduct = async (req, res) => {
    try {
        const id = req.body?.id ? req.body.id : ''
        const { title, price, description, imageUrl } = req.body

        if (id) {
            Product.findById(id)
                .then(p => {
                    if (p.userId.toString() !== req.user._id.toString()) {
                        return false
                    }
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
            const product = new Product({ title, price, description, imageUrl, userId: req.user })
            product.save()
                .then(r => {
                    res.redirect(`/admin/product-list`)
                })
                .catch(e => {
                    console.error(e)
                    return res.redirect('/500-internal-server-error')
                })
        }
    } catch (e) {
        console.error(e)
        res.redirect(`/admin/product-list`)
    }
}

exports.getProductList = async (req, res) => {
    Product.find({ userId: req.user._id })
        .populate('userId')
        .then(products => {
            res.render('admin/product-list', { products, title: 'Admin Products', path: '/admin/product-list' })
        })
        .catch(console.error)
}
//
exports.postDeleteProduct = async (req, res) => {
    try {
        const id = req.body?.id ? req.body.id : ''
        Product.deleteOne({ _id: id, userId: req.user._id })
            .then(() => {
                res.redirect(`/admin/product-list`)
            })
    } catch (e) {
        console.error(e)
        res.redirect(`/admin/product-list`)
    }
}