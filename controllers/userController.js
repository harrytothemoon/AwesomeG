const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Answer, Question } = db
const jwt = require('jsonwebtoken')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.email
    let password = req.body.password

    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: `welcome back! ${user.name}`,
        token: token,
        user: {
          id: user.id, name: user.name, email: user.email, role: user.role
        }
      })
    }).catch(error => console.log(error))
  },
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'warning', message: 'Password settings are not consistent.' })
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          return res.json({ status: 'warning', message: 'E-mail already exists' })
        } else {
          User.create({
            role: req.body.role,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: 'Sign up successfully!' })
          }).catch(error => console.log(error))
        }
      }).catch(error => console.log(error))
    }
  },
  getTeachers: (req, res) => {
    User.findAll(({ where: { role: 'teacher' }, include: Answer }))
      .then(teachers => {
        return res.json({
          teachers,
        })
      }).catch(error => console.log(error))
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: Answer, include: [Question] }, Question]
    }).then(user => {
      res.json({ user })
    }).catch(error => console.log(error))
  },
  putUser: (req, res) => {
    console.log(req.params.id, '---', req.user.id)
    if (Number(req.params.id) === req.user.id) {
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, (err, img) => {
          return User.findByPk(req.params.id)
            .then((user) => {
              user.update({
                name: req.body.name ? req.body.name : user.name,
                password: req.body.password ? bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null) : user.password,
                avatar: img.data.link,
                gender: req.body.gender ? req.body.gender : user.gender,
                introduction: req.body.introduction ? req.body.introduction : user.introduction,
                bankaccount: req.body.bankaccount ? req.body.bankaccount : user.bankaccount,
                grade: req.body.grade ? req.body.grade : user.grade
              })
                .then((user) => {
                  res.json({ status: 'success', message: "資訊成功修改!" })
                }).catch(error => console.log(error))
            }).catch(error => console.log(error))
        })
      }
      else
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name ? req.body.name : user.name,
              password: req.body.password ? bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null) : user.password,
              avatar: user.avatar,
              gender: req.body.gender ? req.body.gender : user.gender,
              introduction: req.body.introduction ? req.body.introduction : user.introduction,
              bankaccount: req.body.introduction ? req.body.introduction : user.introduction,
              grade: req.body.grade ? req.body.grade : user.grade
            })
              .then((user) => {
                res.json({ status: 'success', message: "資訊成功修改!" })
              }).catch(error => console.log(error))
          }).catch(error => console.log(error))
    } else {
      res.json({ status: 'error', message: "沒有權限修改他人資訊！" })
    }
  },
  getCurrentUser: (req, res) => {
    return User.findByPk(req.user.id).then(user => {
      res.json({ user })
    }).catch(error => console.log(error))
  }
}
module.exports = userController