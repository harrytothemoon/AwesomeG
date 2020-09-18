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
            return res.json({ subjects, subject })
          }).catch(error => console.log(error))
      } else {
        return res.json({ subjects })
      }
    }).catch(error => console.log(error))
  },
  postSubject: (req, res) => {
    if (!req.body.name) {
      return res.json({ status: 'error', message: "name didn't exist" })
    } else {
      return Subject.create({
        name: req.body.name
      })
        .then((subject) => {
          return res.json({ status: 'success', message: '成功新增subject!' })
        }).catch(error => console.log(error))
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
              return res.json({ status: 'success', message: '成功修改subject!' })
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
    }
  },
  deleteSubject: (req, res) => {
    return Subject.findByPk(req.params.id)
      .then((subject) => {
        subject.destroy()
          .then((subject) => {
            return res.json({ status: 'success', message: '成功刪除subject!' })
          }).catch(error => console.log(error))
      }).catch(error => console.log(error))
  },

}
module.exports = subjectController