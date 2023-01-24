const mongodb = require('mongodb')
const { getDb } = require('../util/database')

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
    }

    save() {
        const db = getDb()
        return db.collection('products').insertOne(this)
            .then(r => {
                console.log(r)
                return Promise.resolve(r)
            })
            .catch(e => {
                console.error(e)
                throw e
            })
    }

    static fetchAll() {
        const db = getDb()
        return db.collection('products')
            .find() // will return cursor
            .toArray() // use it when u know there is a couple of thousands or maybe hundreds records
            .then(products => products)
            .catch(console.error)
    }

    static findById(id) {
        const db = getDb()
        return db.collection('products')
            .find({ _id: new mongodb.ObjectId(id) })
            .next() // because mongo will return cursor
            .then(product => product)
            .catch(console.error)
    }
}

module.exports = Product