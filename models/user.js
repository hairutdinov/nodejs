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
        item: [
            {
                productId: { type: Schema.Types.ObjectId, required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
})

module.exports = mongoose.model('User', userSchema)