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
const NotificationModel = require('../../models/notification')

describe('# Notification Model', () => {

  before(done => {
    done()
  })

  const Notification = NotificationModel(sequelize, dataTypes)
  const notification = new Notification()
  checkModelName(Notification)('Notification')

  context('properties', () => {
    ;[
      'UserId', 'teacherId', 'msg'
    ].forEach(checkPropertyExists(notification))
  })

  context('associations', () => {
    const User = 'User'
    before(() => {
      Notification.associate({ User })
    })

    it('should belong to user', (done) => {
      expect(Notification.belongsTo).to.have.been.calledWith(User)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Notification.create({}).then((notification) => {
        data = notification
        done()
      })
    })
    it('read', (done) => {
      db.Notification.findByPk(data.id).then((notification) => {
        expect(notification.id).to.be.equal(notification.id)
        done()
      })
    })
    it('update', (done) => {
      db.Notification.update({}, { where: { id: data.id } }).then(() => {
        db.Notification.findByPk(data.id).then((notification) => {
          expect(data.updatedAt).to.be.not.equal(notification.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Notification.destroy({ where: { id: data.id } }).then(() => {
        db.Notification.findByPk(data.id).then((notification) => {
          expect(notification).to.be.equal(null)
          done()
        })
      })
    })
  })


})
