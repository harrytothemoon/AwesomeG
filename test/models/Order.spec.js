var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

const { expect } = require('chai');

const { sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists } = require('sequelize-test-helpers')

const db = require('../../models')
const OrderModel = require('../../models/order')

describe('# Order Model', () => {

  before(done => {
    done()
  })

  const Order = OrderModel(sequelize, dataTypes)
  const order = new Order()
  checkModelName(Order)('Order')

  context('properties', () => {
    ;[
      'amount', 'sn', 'payment_status', 'UserId', 'ProductId'
    ].forEach(checkPropertyExists(order))
  })

  context('associations', () => {
    const Payment = 'Payment'
    const Product = 'Product'
    before(() => {
      Order.associate({ Payment })
      Order.associate({ Product })
    })

    it('should has many payment', (done) => {
      expect(Order.hasMany).to.have.been.calledWith(Payment)
      done()
    })
    it('should belong to product', (done) => {
      expect(Order.belongsTo).to.have.been.calledWith(Product)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Order.create({}).then((order) => {
        data = order
        done()
      })
    })
    it('read', (done) => {
      db.Order.findByPk(data.id).then((order) => {
        expect(order.id).to.be.equal(order.id)
        done()
      })
    })
    it('update', (done) => {
      db.Order.update({}, { where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id).then((order) => {
          expect(data.updatedAt).to.be.not.equal(order.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Order.destroy({ where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id).then((order) => {
          expect(order).to.be.equal(null)
          done()
        })
      })
    })
  })
})
