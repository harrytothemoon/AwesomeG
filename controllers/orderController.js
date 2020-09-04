const db = require('../models')
const { Order, Product } = db
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.ACCOUNT,
    clientId: process.env.CLINENTID,
    clientSecret: process.env.CLINENTSECRET,
    refreshToken: process.env.REFRESHTOKEN,
  },
});

const productController = {
  getOrders: (req, res) => {
    Order.findAll({ where: { UserId: req.user.id }, include: Product }).then((orders) => {
      return res.json({ orders });
    });
  },
  postOrder: (req, res) => {
    return Product.findByPk(req.body.productId).then(product => {
      return Order.create({
        payment_status: req.body.payment_status,
        amount: req.body.amount,
        UserId: req.user.id,
        ProductId: req.body.productId,
      }).then(order => {
        var mailOptions = {
          from: process.env.ACCOUNT,
          to: process.env.ACCOUNT,
          subject: `AwesomeG通知您，訂單已成立!`,
          text: `
          訂單種類：${product.name} 
          訂單金額：${order.amount}
          訂單內容：${product.description}
          `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        return res.json({ status: 'success', message: '成功建立訂單!' })
      })
    })
  },
}
module.exports = productController