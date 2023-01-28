const Product = require('../models/product')
const fileHelper = require('../util/file')

const ITEMS_PER_PAGE = 2

exports.getAddProduct = async (req, res, next) => {
    res.render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
    })
}

exports.postAddProduct = async (req, res, next) => {
    const { title, price, description } = req.body
    const image = req.file

    if (!image) {
        return res.status(422).render(`admin/edit-product`, {
            title: 'Add Product',
            path: '/admin/add-product',
            editing: true,
            hasError: true,
            product: {
                title,
                price,
                description
            },
            errorMessage: 'Attached file is not an image'
        })
    }

    const product = new Product({ title, price, description, imageUrl: image.path, userId: req.user })

    product.save()
        .then(r => {
            res.redirect(`/admin/product-list`)
        })
        .catch(e => {
            console.error(e)
            const error = new Error(e) // 'Creating a product failed.'
            error.httpStatusCode = 500
            return next(error)
        })
}


exports.getEditProduct = async (req, res) => {
    const id = req.params?.id ? req.params.id : ''
    Product.findById(id)
        .then(product => {
            if (!product || product.userId.toString() !== req.user._id.toString()) return res.redirect('/admin/product-list')

            res.render('admin/edit-product', {
                title: 'Add Product',
                path: '/admin/add-product',
                product,
                editing: true,
                hasError: false,
                id,
            })
        })
        .catch(err => console.error(err))
}

exports.postEditProduct = async (req, res, next) => {
    try {
        const id = req.body?.id ? req.body.id : ''
        const { title, price, description } = req.body
        const image = req.file

        Product.findById(id)
            .then(p => {
                if (p.userId.toString() !== req.user._id.toString()) {
                    return false
                }
                p.title = title
                p.price = price
                p.description = description
                if (image) {
                    fileHelper.deleteFile(p.imageUrl)
                    p.imageUrl = image.path
                }
                return p.save()
            })
            .then(r => {
                res.redirect(`/admin/product-list`)
            })
            .catch(e => {
                console.error(e)
                const error = new Error(e)
                error.httpStatusCode = 500
                return next(error)
            })
    } catch (e) {
        console.error(e)
        res.redirect(`/admin/product-list`)
    }
}

exports.getProductList = async (req, res) => {
    const page = +req.query.page || 1
    let totalItems
    Product.find({ userId: req.user._id })
        .populate('userId')
        .countDocuments()
        .then(count => {
            totalItems = count
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('admin/product-list', {
                products,
                title: 'Admin Products',
                path: '/admin/product-list',
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

exports.postDeleteProduct = async (req, res, next) => {
    try {
        const id = req.body?.id ? req.body.id : ''
        Product.findById(id)
            .then(p => {
                if (p) {
                    fileHelper.deleteFile(p.imageUrl)
                }
                return Product.deleteOne({ _id: id, userId: req.user._id })
            })
            .then(() => {
                res.redirect(`/admin/product-list`)
            })
            .catch(e => next(e))
    } catch (e) {
        console.error(e)
        res.redirect(`/admin/product-list`)
    }
}

exports.deleteProduct = async (req, res, next) => {
    const id = req.params?.id ? req.params.id : ''
    Product.findById(id)
        .then(p => {
            if (p) {
                fileHelper.deleteFile(p.imageUrl)
            }
            return Product.deleteOne({ _id: id, userId: req.user._id })
        })
        .then(() => {
            res.status(200).json({
                message: 'success'
            })
        })
        .catch(e => {
            res.status(500).json({
                message: 'Deleting product failed'
            })
        })
}