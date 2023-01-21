// const http = require('http')
const path = require('path')
const express = require('express')
const rootDir = require('./helpers/path')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'pug')
// where to find pug template
app.set('views', 'views')

const adminData = require('./routes/admin')
const shopRoute = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(rootDir, 'public')))

app.use('/admin', adminData.routes)
app.use(shopRoute)

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, 'views', '404-not-found.html'))
})

app.listen(8101)

// const server = http.createServer(app)
// server.listen(8101)

// const http = require('http')
//
// const server = http.createServer((req, res) => {
//     const { url, method } = req
//     switch (url) {
//         case '/':
//             res.setHeader('Content-type', 'text/html')
//             res.write('<html>')
//             res.write('<head>')
//             res.write('<title>Home page</title>')
//             res.write('</head>')
//             res.write('<body>')
//             res.write('<h1>Hello. This is a home page.</h1>')
//             res.write('<form action="/create-user" method="POST"> <input type="text" name="username" placeholder="write a username" /><button>create user</button> </form>')
//             res.write('</body>')
//             res.write('</html>')
//             return res.end()
//         case '/users':
//             res.setHeader('Content-type', 'text/html')
//             res.write('<html>')
//             res.write('<head>')
//             res.write('<title>Home page</title>')
//             res.write('</head>')
//             res.write('<body>')
//             res.write('<ul>')
//             res.write('<li>Admin</li>')
//             res.write('<li>Ivanov</li>')
//             res.write('<li>Petrov</li>')
//             res.write('</ul>')
//             res.write('</body>')
//             res.write('</html>')
//             return res.end()
//         case '/create-user':
//             if (method === 'POST') {
//                 const body = []
//                 req.on('data', chunk => body.push(chunk))
//                 return req.on('end', () => {
//                     const parsedBody = Buffer.concat(body).toString()
//                     const username = parsedBody.split('=')[1]
//                     console.log(username)
//                     res.writeHead(302, { Location: '/' })
//                     return res.end()
//                 })
//             }
//     }
// })
//
// server.listen(8101)