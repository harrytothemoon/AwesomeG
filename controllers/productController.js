const db = require('../models')
const { Product } = db

const productController = {
  getProducts: (req, res) => {
    return Product.findAll({
      raw: true,
      nest: true
    }).then(products => {
      if (req.params.id) {
        Product.findByPk(req.params.id)
          .then((product) => {
            res.json({ products, product })
          })
      } else {
        return res.json({ products })
      }
    })
  },
  postProduct: (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.price) {
      return res.json({ status: 'error', message: "不能有空白欄位！" })
    } else {
      return Product.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      })
        .then((product) => {
          res.json({ status: 'success', message: '成功新增product!' })
        })
    }
  },
  putProduct: (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.price) {
      return res.json({ status: 'error', message: "不能有空白欄位！" })
    } else {
      return Product.findByPk(req.params.id)
        .then((product) => {
          product.update(req.body)
            .then((product) => {
              res.json({ status: 'success', message: '成功修改product!' })
            })
        })
    }
  },
  deleteProduct: (req, res) => {
    return Product.findByPk(req.params.id)
      .then((product) => {
        product.destroy()
          .then((product) => {
            res.json({ status: 'success', message: '成功刪除product!' })
          })
      })
  }
}
module.exports = productController