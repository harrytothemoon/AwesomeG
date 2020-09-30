const db = require('../models')
const { Order, Product, Payment, User } = db
const VueURL = process.env.VueURL

//付款部分
const helpers = require('../payment-helper');

const paymentController = {
  spgatewayCallback: (req, res) => {
    const data = JSON.parse(helpers.create_mpg_aes_decrypt(req.body.TradeInfo));
    return Order.findAll({
      where: { sn: data["Result"]["MerchantOrderNo"] },
      include: Product
    }).then((orders) => {
      if (req.query.from === 'NotifyURL') { return res.json({ status: 'success', message: 'Get the NotifyURL.' }) }
      if (req.query.from === 'ReturnURL') {
        return Payment.create({
          payment_status: orders[0].payment_status,
          amount: data.Result.Amt,
          OrderId: orders[0].id,
          sn: orders[0].sn,
          payment_method: data.Result.PaymentMethod,
          paid_at: Date.now()
        }).then(() => {
          if (req.body.Status === 'SUCCESS') {
            orders[0]
              .update({
                payment_status: 1,
              }).then(() => {
                return User.findByPk(orders[0].dataValues.UserId).then((user) => {
                  user.update({
                    quantity: user.quantity ? user.quantity + Number(orders[0].dataValues.Product.dataValues.description) : Number(orders[0].dataValues.Product.dataValues.description)
                  }).then(() => {
                    return res.redirect(`${VueURL}/#/users/${orders[0].dataValues.UserId}/orders`)
                  }).catch(error => console.log(error))
                })
              }).catch(error => console.log(error))
          } else {
            return res.redirect(`${VueURL}/#/users/${orders[0].dataValues.UserId}/orders`)
          }
        }).catch(error => console.log(error))
      }

    }).catch(error => console.log(error))
  },
}
module.exports = paymentController