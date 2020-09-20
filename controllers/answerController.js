const db = require('../models')
const { Question, Answer, Subject, Scope } = db

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const answerController = {
  getAnswer: (req, res) => {
    Answer.findAll(({ where: { UserId: req.user.id }, include: { model: Question, include: [Subject, Scope] }, raw: true, nest: true, order: [['createdAt', 'DESC']] }))
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
          return res.json({ status: 'success', message: 'Get the Question!' })
        })
    }).catch(error => console.log(error))
  },
  putAnswer: (req, res) => {
    Answer.findOne({ where: { QuestionId: req.body.questionId } })
      .then((answer) => {
        const { file } = req
        if (file) {
          imgur.setClientID(IMGUR_CLIENT_ID);
          let imgurUpload = new Promise((resolve, reject) => {
            imgur.upload(file.path, (err, img) => {
              return resolve(img)
            })
          })
          imgurUpload.then((img) => {
            return answer.update({
              answer: req.body.answer,
              image: img.data.link,
            }).then(() => {
              Question.findByPk(req.body.questionId)
                .then((question) => {
                  question.update({
                    StatusId: 3
                  })
                })
            }).catch(error => console.log(error))
          }).then(() => {
            return res.json({ status: 'success', message: 'The answer has been sent!' })
          }).catch(error => console.log(error))
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
                return res.json({ status: 'success', message: 'The answer has been sent!' })
              }).catch(error => console.log(error))
          }).catch(error => console.log(error))
        }
      }).catch(error => console.log(error))
  }
}
module.exports = answerController