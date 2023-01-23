const fs = require('fs')
const path = require('path')
const rootDir = require('../helpers/path')

const filePath = path.join(rootDir, 'data', 'cart.json')

const getCart = () => {
    return new Promise(resolve => {
        const initObject = { products: [], totalPrice: 0 }
        fs.readFile(filePath, (err, fileContent) => {
            if (err) return resolve(initObject)
            try {
                resolve(JSON.parse(fileContent))
            } catch (e) {
                resolve(initObject)
            }
        })
    })
}

module.exports = class Cart {

    static async addProduct(product) {
        return getCart().then(async cart => {

            const existingProductIndex = cart.products.findIndex(p => p.id === product.id)

            if (existingProductIndex !== -1) {
                const existingProduct = cart.products[existingProductIndex]
                let updatedProduct = {...existingProduct}
                updatedProduct.quantity += 1
                cart.products[existingProductIndex] = updatedProduct
            } else {
                cart.products = [...cart.products, { id: product.id, quantity: 1}]
            }

            cart.totalPrice = +parseFloat(cart.totalPrice + +product.price).toFixed(2)

            fs.writeFile(filePath, JSON.stringify(cart), err => {
                if (err) {
                    throw new Error(`Errors while adding product with id ${ product.id } to cart: `, err)
                }
            })
        })
    }

    static async deleteProduct(product) {
        return getCart().then(async cart => {

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