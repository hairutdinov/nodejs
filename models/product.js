const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Blueprint
const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Product', productSchema)

// const { ObjectId } = require('mongodb')
// const { getDb } = require('../util/database')
//
// class Product {
//     constructor(title, price, description, imageUrl, id = null, userId) {
//         this.title = title
//         this.price = price
//         this.description = description
//         this.imageUrl = imageUrl
//         this._id = id ? new ObjectId(id) : null
//         this.userId = userId
//     }
//
//     save() {
//         const db = getDb()
//         let dbOpt
//         if (this._id) {
//             dbOpt = db.collection('products').updateOne({ _id: this._id }, {
//                 $set: this
//             })
//         } else {
//             dbOpt = db.collection('products').insertOne(this)
//         }
//
//         return dbOpt
//             .then(r => {
//                 console.log(r)
//                 return Promise.resolve(r)
//             })
//             .catch(e => {
//                 console.error(e)
//                 throw e
//             })
//     }
//
//     static fetchAll() {
//         const db = getDb()
//         return db.collection('products')
//             .find() // will return cursor
//             .toArray() // use it when u know there is a couple of thousands or maybe hundreds records
//             .then(products => products)
//             .catch(console.error)
//     }
//
//     static findById(id) {
//         const db = getDb()
//         return db.collection('products')
//             .find({ _id: new ObjectId(id) })
//             .next() // because mongo will return cursor
//             .then(product => product)
//             .catch(console.error)
//     }
//
//     static deleteById(id) {
//         const db = getDb()
//         return db.collection('products')
//             .deleteOne({ _id: new ObjectId(id) })
//             .then(r => r)
//             .catch(console.error)
//     }
// }
//
// module.exports = Product∂