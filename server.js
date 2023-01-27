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
const multer = require('multer')

const csrf = require('csurf')
const csrfProtection = csrf()

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const uniqueSuffix = new Date().toISOString()
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const fileFilter = (req, file, callback) => {
    switch (file.mimetype) {
        case 'image/png':
        case 'image/jpg':
        case 'image/jpeg':
            callback(null, true)
            break;
        default:
            callback(null, false)
    }
}

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
app.use(multer({ storage: fileStorage, fileFilter }).single('image'))

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
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken =  req.csrfToken()
    next()
})

app.use((req, res, next) => {
    if (!req.session.user) return next()
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) return next()
            req.user = user
            next()
        })
        .catch(e => {
            next(new Error(e))
        })
})

app.use('/admin', adminRoute)
app.use(shopRoute)
app.use(authRoute)

app.use('/500-internal-server-error', errorController.internalServerError)
app.use(errorController.notFound)

app.use((e, req, res, next) => {
    // e.httpStatusCode
    // res.redirect('/500-internal-server-error')
    res.status(500).render('500-internal-server-error', { title: '500 Internal Server Error' })
})

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_CONNECTION_URI)
    .then(r => {
        console.log('Connected successfully to MongoDB server');
        app.listen(8101)
    })
    .catch(e => {
        console.error(e)
    })