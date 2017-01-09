import express from 'express'
import http from 'http'

// create app
const app = express()

// create server
const transport = http.createServer(app)

const apps = require('../apps.json')

app.get('/', (req, res) => {
  res.json(apps)
})

transport.listen(8080, () => {
  console.log('App listening on port 8080')
})
