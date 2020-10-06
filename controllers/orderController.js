const db = require('../models')
const { Order, Product } = db
const nodemailer = require('nodemailer');

//通知信
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

//付款部分
const helpers = require('../payment-helper');

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({ where: { UserId: req.user.id }, include: Product, order: [['createdAt', 'DESC']] })
      .then((orders) => {
        return res.json({ orders });
      }).catch(error => console.log(error));
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
          to: req.user.email,
          subject: `AwesomeG通知您，訂單已成立!`,
          text: `
          訂單種類：${product.name} 
          訂單金額：NT$ ${order.amount}
          訂單內容：可以問 ${product.description} 題
          `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        return res.json({ status: 'success', message: 'Place an order successfully!' })
      }).catch(error => console.log(error))
    }).catch(error => console.log(error))
  },
  getPayment: (req, res) => {
    return Order.findByPk(req.params.id, { include: Product }).then((order) => {
      const tradeInfo = helpers.getTradeInfo(
        order.toJSON().amount,
        `AwesomeG-${order.toJSON().Product.name}`,
        req.user.email
      );
      order.update({
        sn: Number(tradeInfo.MerchantOrderNo),
      })
        .then((order) => {
          return res.json({ order: order.toJSON(), tradeInfo });
        }).catch(error => console.log(error))
    }).catch(error => console.log(error))
  },
}
module.exports = orderController