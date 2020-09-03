const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

require('./routes')(app)