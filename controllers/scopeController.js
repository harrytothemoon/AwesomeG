const db = require('../models')
const { Scope } = db

const scopeController = {
  getScopes: (req, res) => {
    return Scope.findAll({
      raw: true,
      nest: true
    }).then(scopes => {
      if (req.params.id) {
        Scope.findByPk(req.params.id)
          .then((scope) => {
            res.json({ scopes, scope })
          })
      } else {
        return res.json({ scopes })
      }
    })
  },
  postScope: (req, res) => {
    if (!req.body.name) {
      return res.json({ status: 'error', message: "name didn't exist" })
    } else {
      return Scope.create({
        name: req.body.name
      })
        .then((scope) => {
          res.json({ status: 'success', message: '成功新增scope!' })
        })
    }
  },
  putScope: (req, res) => {
    if (!req.body.name) {
      return res.json({ status: 'error', message: "name didn't exist" })
    } else {
      return Scope.findByPk(req.params.id)
        .then((scope) => {
          scope.update(req.body)
            .then((scope) => {
              res.json({ status: 'success', message: '成功修改scope!' })
            })
        })
    }
  },
  deleteScope: (req, res) => {
    return Scope.findByPk(req.params.id)
      .then((scope) => {
        scope.destroy()
          .then((scope) => {
            res.json({ status: 'success', message: '成功刪除scope!' })
          })
      })
  }
}
module.exports = scopeController