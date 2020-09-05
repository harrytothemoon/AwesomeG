const db = require('../models')
const crypto = require("crypto");
const { Order, Product, Payment, User } = db
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
const { resolve } = require('path');
const { date } = require('faker');

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({ where: { UserId: req.user.id }, include: Product })
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
          to: process.env.ACCOUNT,
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
        return res.json({ status: 'success', message: '成功建立訂單!' })
      }).catch(error => console.log(error))
    }).catch(error => console.log(error))
  },

  getPayment: (req, res) => {
    return Order.findByPk(req.params.id, { include: Product }).then((order) => {
      const tradeInfo = helpers.getTradeInfo(
        order.toJSON().amount,
        `AwesomeG-${order.toJSON().Product.name}`,
        process.env.ACCOUNT
      );
      order.update({
        sn: Number(tradeInfo.MerchantOrderNo),
      })
        .then((order) => {
          res.send(`<form name='Spgateway' action='${tradeInfo.PayGateWay}' method="POST">
            MerchantID:
            <input type="text" name="MerchantID" value="${tradeInfo.MerchantID}"><br>
            TradeInfo:
            <input type="text" name="TradeInfo" value="${tradeInfo.TradeInfo}"><br>
            TradeSha:
            <input type="text" name="TradeSha" value="${tradeInfo.TradeSha}"><br>
            Version:
            <input type="text" name="Version" value="${tradeInfo.Version}"><br>
            <button type="submit" class="btn btn-primary">Payment</button>
          </form>`)
          // return res.json({ order: order.toJSON(), tradeInfo });
          return res.render("payment", { order: order.toJSON(), tradeInfo })
        }).catch(error => console.log(error))
    }).catch(error => console.log(error))
  },
  spgatewayCallback: (req, res) => {
    const data = JSON.parse(helpers.create_mpg_aes_decrypt(req.body.TradeInfo));
    return Order.findAll({
      where: { sn: data["Result"]["MerchantOrderNo"] },
      include: Product
    }).then((orders) => {
      orders[0]
        .update({
          payment_status: 1,
        }).then(() => {
          if (req.query.from === 'NotifyURL') {
            return User.findByPk(orders[0].dataValues.UserId).then((user) => {
              user.update({
                quantity: user.quantity ? user.quantity + Number(orders[0].dataValues.Product.dataValues.description) : Number(orders[0].dataValues.Product.dataValues.description)
              }).then(() => {
                return Payment.create({
                  payment_status: orders[0].payment_status,
                  amount: data.Result.Amt,
                  OrderId: orders[0].id,
                  sn: orders[0].sn,
                  payment_method: data.Result.PaymentMethod,
                  paid_at: Date.now()
                }).then(() => {
                  return res.json({ status: 'success', message: '成功付款!' })
                }).catch(error => console.log(error))
              })
            }).catch(error => console.log(error))
          }
          return res.json({ status: 'success', message: '成功付款!' })
        }).catch(error => console.log(error))
    }).catch(error => console.log(error))
  },
}
module.exports = orderController