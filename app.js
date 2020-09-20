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

  socket.on("userInfo", (id, role) => {
    console.log(id, role)
    socket.join(id)
    socket.join(role)
  });

  socket.on("postQuestions", (id, role, name, avatar, date) => {
    //TODO 資料庫存取訊息
    io.in('teacher').emit("postQuestions", { id, role, name, avatar, date });
  });

  socket.on("postAnswers", (id, role, name, avatar, UserId, StatusId, date) => {
    //TODO 資料庫存取訊息
    io.in(UserId).emit("postAnswers", { id, role, name, avatar, UserId, StatusId, date });
  });
  socket.on("putAnswers", (id, role, name, avatar, UserId, StatusId, date) => {
    //TODO 資料庫存取訊息
    io.in(UserId).emit("postAnswers", { id, role, name, avatar, UserId, StatusId, date });
  });

  socket.on("unReadUpdate", () => {
    //TODO 資料庫存取訊息
    io.in('teacher').emit("postQuestions", { id, role, name, avatar, date });
  });

  socket.on("openNotifyBox", (message) => {
    //TODO 資料庫更新unread為0
    socket.emit("openNotifyBox", message);
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