const fs = require('fs')
const path = require('path')
const rootDir = require('../helpers/path')

const filePath = path.join(rootDir, 'data', 'products.json')

const getProductsPromise = () => {
    return new Promise(resolve => {
        fs.readFile(filePath, (err, fileContent) => {
            if (err) return resolve([])
            resolve(JSON.parse(fileContent))
        })
    })
}

module.exports = class Product {
    constructor(title) {
        this.title = title
    }

    save() {
        getProductsPromise().then(products => {
            products.push(this)
            fs.writeFile(filePath, JSON.stringify(products), err => {
                console.error(err)
            })
        })
    }

    static fetchAll() {
        return getProductsPromise()
    }
}