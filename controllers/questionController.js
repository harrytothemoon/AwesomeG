const db = require('../models')
const { Question, Status, Subject, Scope, Answer, User } = db

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const questionController = {
  getQuestions: (req, res) => {
    Question.findAll(({
      where: { StatusId: 1 }, include: [Subject, Scope, Status], raw: true,
      nest: true, order: [['createdAt', 'DESC']]
    })).then(questions => {
      return res.json({
        questions,
      })
    }).catch(error => console.log(error))
  },
  getMyQuestions: (req, res) => {
    Question.findAll(({
      where: { UserId: req.user.id },
      include: [Status, { model: Answer, include: User }, Subject, Scope],
      raw: true,
      nest: true,
      order: [['updatedAt', 'DESC']]
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
            let imgurUpload = new Promise((resolve, reject) => {
              imgur.upload(file.path, (err, img) => {
                return resolve(img)
              })
            })
            imgurUpload.then((img) => {
              return Question.create({
                SubjectId: req.body.subjectId,
                ScopeId: req.body.scopeId,
                UserId: req.user.id,
                description: req.body.description,
                StatusId: 1,
                image: img.data.link,
              })
            }).then((question) => {
              return res.json({ status: 'success', message: 'Post the question successfully!' })
            }).catch(error => console.log(error))
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
              return res.json({ status: 'success', message: 'Post the question successfully!' })
            }).catch(error => console.log(error))
          }
        }).catch(error => console.log(error))
      } else {
        return res.json({ status: 'warning', message: 'Insufficient balance, please recharge!' })
      }
    })
  },
}
module.exports = questionController