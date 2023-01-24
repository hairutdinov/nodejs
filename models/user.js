const { ObjectId } = require('mongodb')
const { getDb } = require('../util/database')

class User {
    constructor(username, email, cart, id) {
        this.username = username
        this.email = email
        this.cart = cart // { items: [] }
        this._id = id
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

    static findById(id) {
        const db = getDb()
        return db.collection('users')
            .findOne({ _id: new ObjectId(id) })
            .then(u => u)
            .catch(console.error)
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString())
        let newQuantity = 1
        const updatedCartItems = [...this.cart.items]
        if (cartProductIndex !== -1) {
            newQuantity = +this.cart.items[cartProductIndex].quantity + 1
            updatedCartItems[cartProductIndex].quantity = newQuantity
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity })
        }
        const updatedCart = { items: updatedCartItems }
        return getDb()
            .collection('users')
            .updateOne(
                {_id: new ObjectId(this._id)},
                {$set: {cart: updatedCart}}
            )

    }
}
module.exports = User