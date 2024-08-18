const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
    
    // Initialize Chroma
    fetch('http://localhost:3000/api/init-chroma', { method: 'POST' })
      .then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error initializing Chroma:', error))
  })
})