import express from 'express'
import http from 'http'
import apps from './middlewares/apps'

// create app
const app = express()

// create server
const transport = http.createServer(app)

app.use('/apps', apps)

transport.listen(8080, () => {
  console.log('App listening on port 8080')
})
