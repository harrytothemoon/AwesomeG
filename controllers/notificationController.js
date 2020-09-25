const db = require('../models')
const { User, Notification } = db

const notificationController = {
  getNotifications: (req, res) => {
    return Notification.findAll(({
      where: { UserId: req.user.id },
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
      return res.json({ notifications })
    }).catch(error => console.log(error))
  },
}
module.exports = notificationController