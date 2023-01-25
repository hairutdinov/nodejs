// const http = require('http')
const path = require('path')
const express = require('express')
const rootDir = require('./helpers/path')
const bodyParser = require('body-parser')

require('dotenv').config();

const mongoose = require('mongoose')

const errorController = require('./controllers/error')

// const User = require('./models/user')

const app = express()

app.set('view engine', 'pug')
// where to find pug template
app.set('views', 'views')

const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(rootDir, 'public')))

// app.use((req, res, next) => {
//     User.findById('63cff5f6d6adf1fa78835f79')
//         .then(user => {
//             req.user = new User(user.username, user.email, user.cart, user._id)
//             next()
//         })
//         .catch(console.error)
// })

app.use('/admin', adminRoute)
app.use(shopRoute)

app.use(errorController.actionNotFound)

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_CONNECTION_URI)
    .then(r => {
        console.log('Connected successfully to MongoDB server');
        app.listen(8101)
    })
    .catch(console.error)