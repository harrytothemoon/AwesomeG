const db = require('../models')
const { Question, Status, Subject, Scope, Answer } = db

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
        })
      })
    })
  },
  getMyQuestions: (req, res) => {
    Question.findAll(({ where: { UserId: req.user.id } }, { include: [Status, Answer] })).then(questions => {
      return res.json({
        questions,
      })
    })
  },
  postQuestion: (req, res) => {
    const { file } = req
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
        })
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
      })
    }
  },
}
module.exports = questionController