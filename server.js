// const http = require('http')
const path = require('path')
const express = require('express')
const rootDir = require('./helpers/path')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const sequelize = require('./util/database')

const Product = require('./models/product')
const User = require('./models/user')

const app = express()

app.set('view engine', 'pug')
// where to find pug template
app.set('views', 'views')

const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(rootDir, 'public')))

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            // sequelize object
            req.user = user
            next()
        })
        .catch(console.error)
})

app.use('/admin', adminRoute)
app.use(shopRoute)

app.use(errorController.actionNotFound)

// user created product
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)


// TODO delete force: true on prod
sequelize.sync({ force: true })
    .then(result => {
        // console.log(result)
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Bulat', 'email': 'bulat@test.com' })
        }
        return Promise.resolve(user)
    })
    .then((user) => {
        // console.log(user)
        app.listen(8101)
    })
    .catch(console.error)

