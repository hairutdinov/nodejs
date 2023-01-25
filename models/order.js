const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Blueprint
const orderSchema = new Schema({
    products: [
        {
            product: { type: Object, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    user: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    }
})

module.exports = mongoose.model('Order', orderSchema)