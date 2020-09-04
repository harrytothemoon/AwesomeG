const db = require('../models')
const { Subject } = db

const subjectController = {
  getSubjects: (req, res) => {
    return Subject.findAll({
      raw: true,
      nest: true
    }).then(subjects => {
      if (req.params.id) {
        Subject.findByPk(req.params.id)
          .then((subject) => {
            res.json({ subjects, subject })
          })
      } else {
        return res.json({ subjects })
      }
    })
  },
  postSubject: (req, res) => {
    if (!req.body.name) {
      return res.json({ status: 'error', message: "name didn't exist" })
    } else {
      return Subject.create({
        name: req.body.name
      })
        .then((subject) => {
          res.json({ status: 'success', message: '成功新增subject!' })
        })
    }
  },
  putSubject: (req, res) => {
    if (!req.body.name) {
      return res.json({ status: 'error', message: "name didn't exist" })
    } else {
      return Subject.findByPk(req.params.id)
        .then((subject) => {
          subject.update(req.body)
            .then((subject) => {
              res.json({ status: 'success', message: '成功修改subject!' })
            })
        })
    }
  },
  deleteSubject: (req, res) => {
    return Subject.findByPk(req.params.id)
      .then((subject) => {
        subject.destroy()
          .then((subject) => {
            res.json({ status: 'success', message: '成功刪除subject!' })
          })
      })
  },

}
module.exports = subjectController