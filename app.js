const express = require('express')
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const port = process.env.PORT || 3000

io.on("connection", (socket) => {
  console.log("user connected");
  io.emit("chat message", "hello");

  socket.on("private message", (message) => {
    socket.emit("chat message", message);
  });

  socket.on("global message", (message) => {
    io.emit("chat message", message);
  });

  socket.on("broadcast message", (message) => {
    socket.broadcast.emit("chat message", message);
  });
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

require('./routes')(app)