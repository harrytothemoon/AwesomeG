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
            return res.json({ products, product })
          }).catch(error => console.log(error))
      } else {
        return res.json({ products })
      }
    }).catch(error => console.log(error))
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
          return res.json({ status: 'success', message: '成功新增product!' })
        }).catch(error => console.log(error))
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
              return res.json({ status: 'success', message: '成功修改product!' })
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
    }
  },
  deleteProduct: (req, res) => {
    return Product.findByPk(req.params.id)
      .then((product) => {
        product.destroy()
          .then((product) => {
            return res.json({ status: 'success', message: '成功刪除product!' })
          }).catch(error => console.log(error))
      }).catch(error => console.log(error))
  }
}
module.exports = productController