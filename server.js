// const http = require('http')
const path = require('path')
const express = require('express')
const rootDir = require('./helpers/path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const errorController = require('./controllers/error')
const User = require('./models/user')
const flash = require('connect-flash')

const csrf = require('csurf')
const csrfProtection = csrf()

const app = express()

require('dotenv').config();

const store = new MongoDBStore({
    uri: process.env.MONGO_CONNECTION_URI,
    collection: 'sessions'
})


app.set('view engine', 'pug')
app.set('views', 'views')

const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')
const authRoute = require('./routes/auth')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(rootDir, 'public')))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // session will not be saved on every request/every response, only if smth change
    saveUninitialized: false,
    store
}))

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    if (!req.session.user) return next()
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) return next()
            req.user = user
            next()
        })
        .catch(e => {
            throw new Error(e)
        })
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken =  req.csrfToken()
    next()
})

app.use('/admin', adminRoute)
app.use(shopRoute)
app.use(authRoute)

app.use('/500-internal-server-error', errorController.internalServerError)
app.use(errorController.notFound)

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_CONNECTION_URI)
    .then(r => {
        console.log('Connected successfully to MongoDB server');
        app.listen(8101)
    })
    .catch(e => {
        console.error(e)
    })