const db = require('../models')
const { Question, Status, Subject, Scope, Answer } = db

const answerController = {
  getAnswer: (req, res) => {
    Answer.findAll(({ where: { UserId: req.user.id }, include: Question }))
      .then(answers => {
        return res.json({ answers })
      })
  },
  postAnswer: (req, res) => {
    return Answer.create({
      QuestionId: req.body.questionId,
      UserId: req.user.id,
    }).then(() => {
      Question.findByPk(req.body.questionId)
        .then((question) => {
          question.update({
            StatusId: 2
          })
        }).then(() => {
          return res.json({ status: 'success', message: '已獲取題目！' })
        })
    })
  },
  putAnswer: (req, res) => {
    Answer.findOne({ where: { QuestionId: req.body.questionId } })
      .then((answer) => {
        answer.update({
          image: 'test image',
          answer: req.body.answer,
        }).then(() => {
          Question.findByPk(req.body.questionId)
            .then((question) => {
              question.update({
                StatusId: 3
              })
            }).then(() => {
              return res.json({ status: 'success', message: '答案已送出！' })
            })
        })
      })
  }
}
module.exports = answerController