const http = require('http')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
async function handle(filePath, res) {
  const extname = path.extname(filePath)
  let contentType
  switch (extname) {
  case '.js':
    contentType = 'text/javascript'
    break
  case '.css':
    contentType = 'text/css'
    break
  case '.json':
    contentType = 'application/json'
    break
  case '.png':
    contentType = 'image/png'
    break
  case '.jpg':
    contentType = 'image/jpg'
    break
  default:
    contentType = 'text/html'
    break
  }
  try {
    const data = await readFile(filePath, 'utf8').then(data => data)
    res.writeHead(200, { 'Content-type': contentType })
    console.log(data)
    res.end(data)
  } catch (err) {
    console.log(err)
  }
}

const app = http.createServer(async (req, res) => {
  const filePath = path.join(__dirname, '/public', req.url === '/' ? 'index.html' : req.url)
  handle(filePath, res)
})

app.listen(8080, () => console.log('App is running on port 8080...'))
