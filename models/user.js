const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Blueprint
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
                quantity: { type: Number, required: true }
            }
        ]
    }
})

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString())
    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]

    if (cartProductIndex !== -1) {
        newQuantity = +this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
        updatedCartItems.push({ productId: product._id, quantity: newQuantity })
    }

    this.cart = { items: updatedCartItems }
    return this.save()
}

userSchema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items.filter(item => item.productId.toString() !== productId.toString())
    return this.save()
}

module.exports = mongoose.model('User', userSchema)