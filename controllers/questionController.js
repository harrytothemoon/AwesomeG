const db = require('../models')
const { Question, Status, Subject, Scope, Answer, User } = db

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const questionController = {
  getQuestions: (req, res) => {
    Question.findAll(({ include: [Subject, Scope] })).then(questions => {
      Subject.findAll({
        raw: true,
        nest: true
      }).then(subjects => {
        Scope.findAll({
          raw: true,
          nest: true
        }).then(scopes => {
          return res.json({
            questions,
            subjects,
            scopes,
          })
        }).catch(error => console.log(error))
      }).catch(error => console.log(error))
    })
  },
  getMyQuestions: (req, res) => {
    Question.findAll(({
      where: { UserId: req.user.id },
      include: [Status, Answer],
      raw: true,
      nest: true
    }))
      .then(questions => {
        return res.json({
          questions,
        })
      }).catch(error => console.log(error))
  },
  postQuestion: (req, res) => {
    const { file } = req
    return User.findByPk(req.user.id).then((user) => {
      if (user.toJSON().quantity > 0) {
        user.update({
          quantity: user.quantity - 1
        }).then(() => {
          if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID);
            imgur.upload(file.path, (err, img) => {
              return Question.create({
                SubjectId: req.body.subjectId,
                ScopeId: req.body.scopeId,
                UserId: req.user.id,
                description: req.body.description,
                StatusId: 1,
                image: img.data.link,
              }).then((question) => {
                res.json({ status: 'success', message: '成功提問！' })
              }).catch(error => console.log(error))
            })
          }
          else {
            return Question.create({
              SubjectId: req.body.subjectId,
              ScopeId: req.body.scopeId,
              UserId: req.user.id,
              description: req.body.description,
              image: null,
              StatusId: 1,
            }).then((question) => {
              res.json({ status: 'success', message: '成功提問！' })
            }).catch(error => console.log(error))
          }
        }).catch(error => console.log(error))
      } else {
        return res.json({ status: 'success', message: '無足夠題數，請充值！' })
      }
    })
  },
}
module.exports = questionController