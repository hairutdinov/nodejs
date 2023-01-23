const fs = require('fs')
const path = require('path')
const rootDir = require('../helpers/path')

const filePath = path.join(rootDir, 'data', 'products.json')

const ATTRIBUTE_TITLE = 'title'
const ATTRIBUTE_IMAGE_URL = 'imageUrl'
const ATTRIBUTE_DESCRIPTION = 'description'
const ATTRIBUTE_PRICE = 'price'


const getProductsPromise = () => {
    return new Promise(resolve => {
        fs.readFile(filePath, (err, fileContent) => {
            if (err) return resolve([])
            try {
                resolve(JSON.parse(fileContent))
            } catch (e) {
                console.error(e)
                resolve([])
            }
        })
    })
}

module.exports = class Product {
    constructor() {
        this.id = ''
        this.load({ title: '', imageUrl: '', description: '', price: '' })
    }

    save() {
        getProductsPromise().then(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(p => p.id == this.id)
                if (products[existingProductIndex] === undefined) {
                    throw Error(`Can't find product with id ${ this.id }`)
                }
                let updatedProductList = [...products]
                updatedProductList[existingProductIndex] = this
                products = updatedProductList
            } else {
                this.id = products.length + 1
                products.push(this)
            }

            fs.writeFile(filePath, JSON.stringify(products), err => {
                console.error(err)
            })
        })
    }

    static fetchAll() {
        return getProductsPromise()
    }

    static findByProductId(productId) {
        return getProductsPromise()
            .then(products => {
                const index = products.findIndex(p => p.id == productId)

                try {
                    if (products[index] === undefined) {
                        throw Error(`Can't find product with id ${ productId }`)
                    }

                    const product = new this
                    product.id = productId
                    product.load(products[index])

                    return product
                } catch (e) {
                    console.error(e.message)
                    throw e
                }
            })
    }

    static deleteByProductId(productId) {
        return getProductsPromise()
            .then(products => {
                const index = products.findIndex(p => p.id == productId)

                try {
                    if (products[index] === undefined) {
                        throw Error(`Can't find product with id ${ productId }`)
                    }

                    products.splice(index, 1)

                    fs.writeFile(filePath, JSON.stringify(products), err => {
                        console.error(err)
                        return true
                    })
                } catch (e) {
                    console.error(e.message)
                    throw e
                }
            })
    }

    static getAttributes() {
        return [ATTRIBUTE_TITLE, ATTRIBUTE_IMAGE_URL, ATTRIBUTE_DESCRIPTION, ATTRIBUTE_PRICE]
    }

    static getAttributeLabels() {
        return {
            ATTRIBUTE_TITLE: 'Title',
            ATTRIBUTE_IMAGE_URL: 'Image URL',
            ATTRIBUTE_DESCRIPTION: 'Description',
            ATTRIBUTE_PRICE: 'Price'
       }
    }

    static getAttributeLabel(attribute) {
        return this.getAttributeLabels()[attribute]
    }

    load(data) {
        data = JSON.parse(JSON.stringify(data))
        this.constructor.getAttributes().forEach(field => {
            if (
                data[field] !== undefined &&
                this.id && data[field] || !this.id
            ) {
                this[field] = data[field]
            }
        })
    }
}