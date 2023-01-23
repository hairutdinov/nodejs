const fs = require('fs')
const path = require('path')
const rootDir = require('../helpers/path')
const Product = require('./product')

const filePath = path.join(rootDir, 'data', 'cart.json')

const getCart = () => {
    return new Promise(resolve => {
        fs.readFile(filePath, (err, fileContent) => {
            if (err) return resolve({ products: [], totalPrice: 0 })
            try {
                resolve(JSON.parse(fileContent))
            } catch (e) {
                resolve({})
            }
        })
    })
}

module.exports = class Cart {

    static async addProduct(product) {
        return getCart().then(async cart => {
            if (!cart?.products) cart.products = []
            if (!cart?.totalPrice) cart.totalPrice = 0

            const existingProductIndex = cart.products.findIndex(p => p.id === product.id)

            if (existingProductIndex !== -1) {
                const existingProduct = cart.products[existingProductIndex]
                let updatedProduct = {...existingProduct}
                updatedProduct.quantity += 1
                cart.products[existingProductIndex] = updatedProduct
            } else {
                cart.products = [...cart.products, { id: product.id, quantity: 1}]
            }

            cart.totalPrice = parseFloat(cart.totalPrice + +product.price).toFixed(2)

            fs.writeFile(filePath, JSON.stringify(cart), err => {
                console.error(err)
            })
        })
    }

    static async deleteProduct(product) {
        return getCart().then(async cart => {
            if (!cart?.products) cart.products = []
            if (!cart?.totalPrice) cart.totalPrice = 0

            const existingProductIndex = cart.products.findIndex(p => p.id == product.id)

            if (existingProductIndex === -1) {
                return true
            }

            const existingCartProduct = cart.products[existingProductIndex]
            const deletingProductTotalPrice = product.price * existingCartProduct.quantity

            cart.totalPrice = cart.totalPrice - deletingProductTotalPrice
            cart.products.splice(existingProductIndex, 1)

            fs.writeFile(filePath, JSON.stringify(cart), err => {
                if (err) {
                    throw new Error(`Errors while deleting product with id ${ product.id } from cart: `, err)
                }

                return true
            })
        })
    }
}