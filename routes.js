const fs = require('fs')

const requestHandler = (req, res) => {
    const { url, method } = req
    switch (url) {
        case '/':
            res.setHeader('Content-type', 'text/html')
            res.write('<html>')
            res.write('<head><title>My first page</title></head>')
            res.write('<body>')
            res.write('<form action="/message" method="POST"> <input type="text" name="message" /> <button>submit</button> </form>')
            res.write('</body>')
            res.write('</html>')
            return res.end()
        case '/message':
            if (method === 'POST') {
                const body = [];
                req.on('data', chunk => {
                    body.push(chunk)
                })
                return req.on('end', () => {
                    const parsedBody = Buffer.concat(body).toString()
                    const message = parsedBody.split('=')[1]
                    fs.writeFile('message.txt', message,  err => {
                        console.error(err)
                        res.writeHead(302, { Location: '/' })
                        return res.end()
                    })
                    console.log('waiting data...')
                })
            }
    }
    // console.log(req.url, req.method, req.headers)
    // res.setHeader('Content-type', 'text/html')
    // res.write('<html>')
    // res.write('<head><title>My first page</title></head>')
    // res.write('<body>')
    // res.write('<form action="/message" method="POST"> <input type="text" name="message" /> <button>submit</button> </form>')
    // res.write('</body>')
    // res.write('</html>')
    // res.end()
    // process.exit()
}

// module.exports = {
//     handler: requestHandler
// };
// new syntax
exports.handler = requestHandler