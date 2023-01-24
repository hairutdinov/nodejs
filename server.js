// const http = require('http')
const path = require('path')
const express = require('express')
const rootDir = require('./helpers/path')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const { mongoConnect } = require('./util/database')

const app = express()

app.set('view engine', 'pug')
// where to find pug template
app.set('views', 'views')

const adminRoute = require('./routes/admin')
// const shopRoute = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(rootDir, 'public')))

// app.use((req, res, next) => {
//     User.findByPk(1)
//         .then(user => {
//             // sequelize object
//             req.user = user
//             next()
//         })
//         .catch(console.error)
// })

app.use('/admin', adminRoute)
// app.use(shopRoute)

app.use(errorController.actionNotFound)

mongoConnect()
    .then(client => {
        console.log('Connected successfully to server');
        console.log(client)
        app.listen(8101)
    })
    .catch(e => {
        console.error(e)
    })