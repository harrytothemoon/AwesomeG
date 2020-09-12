const db = require('../models')
const { Question, Answer, Subject, Scope } = db

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const answerController = {
  getAnswer: (req, res) => {
    Answer.findAll(({ where: { UserId: req.user.id }, include: { model: Question, include: [Subject, Scope] }, raw: true, nest: true }))
      .then(answers => {
        return res.json({ answers })
      }).catch(error => console.log(error))
  },
  postAnswer: (req, res) => {
    return Answer.create({
      QuestionId: req.body.questionId,
      UserId: req.user.id,
    }).then((answer) => {
      Question.findByPk(req.body.questionId)
        .then((question) => {
          question.update({
            StatusId: 2,
            AnswerId: answer.toJSON().id
          })
        }).then(() => {
          return res.json({ status: 'success', message: '已獲取題目！' })
        })
    }).catch(error => console.log(error))
  },
  putAnswer: (req, res) => {
    Answer.findOne({ where: { QuestionId: req.body.questionId } })
      .then((answer) => {
        const { file } = req
        if (file) {
          imgur.setClientID(IMGUR_CLIENT_ID);
          imgur.upload(file.path, (err, img) => {
            return answer.update({
              answer: req.body.answer,
              image: img.data.link,
            }).then(() => {
              Question.findByPk(req.body.questionId)
                .then((question) => {
                  question.update({
                    StatusId: 3
                  })
                }).then(() => {
                  return res.json({ status: 'success', message: '答案已送出！' })
                }).catch(error => console.log(error))
            }).catch(error => console.log(error))
          })
        }
        else {
          return answer.update({
            answer: req.body.answer,
            image: null,
          }).then(() => {
            Question.findByPk(req.body.questionId)
              .then((question) => {
                question.update({
                  StatusId: 3
                })
              }).then(() => {
                return res.json({ status: 'success', message: '答案已送出！' })
              }).catch(error => console.log(error))
          }).catch(error => console.log(error))
        }
      }).catch(error => console.log(error))
  }
}
module.exports = answerController