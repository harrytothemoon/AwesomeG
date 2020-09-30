const express = require('express')
const http = require("http");
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

module.exports = server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
require('./socketServer')(server)

require('./routes')(app)