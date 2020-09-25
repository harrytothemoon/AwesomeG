const db = require('./models')
const { User, Notification } = db

module.exports = socketServer = (server) => {
  const socketIO = require("socket.io");
  const io = socketIO(server)

  io.on("connection", (socket) => {
    socket.on("userInfo", (id, role) => {
      socket.join(id)
      socket.join(role)
    });

    socket.on("postQuestions", (id, role, name, avatar, createdAt) => {
      io.in('teacher').emit("postQuestions", { id, role, name, avatar, createdAt });
    });

    socket.on("postAnswers", (id, UserId) => {
      Notification.create({
        UserId: UserId,
        teacherId: id,
        msg: "get your question!"
      }).then(() => {
        User.findByPk(UserId).then((user) => {
          user.update({
            unread: user.unread ? user.unread = user.unread + 1 : 1
          }).then(() => {
            Notification.findAll(({
              where: { UserId: UserId },
              order: [['createdAt', 'DESC']],
              raw: true,
              nest: true,
              limit: 10,
              include: [User, { model: User, as: 'teacher' }]
            })).then(notifications => {
              notifications = notifications.map(notification => ({
                "createdAt": notification.createdAt,
                "avatar": notification.teacher.avatar,
                "name": notification.teacher.name,
                "msg": notification.msg,
                "unRead": notification.User.unread
              }))
              return io.in(UserId).emit("postAnswers", notifications);
            }).catch(error => console.log(error))
          })
        })
      })
    });

    socket.on("putAnswers", (id, UserId) => {
      Notification.create({
        UserId: UserId,
        teacherId: id,
        msg: "has answered your question!"
      }).then(() => {
        User.findByPk(UserId).then((user) => {
          user.update({
            unread: user.unread ? user.unread = user.unread + 1 : 1
          }).then(() => {
            Notification.findAll(({
              where: { UserId: UserId },
              order: [['createdAt', 'DESC']],
              raw: true,
              nest: true,
              limit: 10,
              include: [User, { model: User, as: 'teacher' }]
            })).then(notifications => {
              notifications = notifications.map(notification => ({
                "createdAt": notification.createdAt,
                "avatar": notification.teacher.avatar,
                "name": notification.teacher.name,
                "msg": notification.msg,
                "unRead": notification.User.unread
              }))
              return io.in(UserId).emit("putAnswers", notifications);
            })
          })
        })
      })
    });

    socket.on("openNotifyBox", (id) => {
      User.findByPk(id).then((user) => {
        user.update({
          unread: 0
        }).then(() => {
          socket.emit("openNotifyBox", 0);
        })
      })
    });

    socket.on("userlogout", (id, role) => {
      socket.leave(id)
      socket.leave(role)
    });
  });
}