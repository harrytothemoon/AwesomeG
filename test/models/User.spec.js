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
const UserModel = require('../../models/user')

describe('# User Model', () => {

  before(done => {
    done()
  })

  const User = UserModel(sequelize, dataTypes)
  const user = new User()
  checkModelName(User)('User')

  context('properties', () => {
    ;[
      'name', 'email', 'password', 'introduction', 'role', 'avatar', 'gender', 'quantity', 'grade', 'bankaccount', 'expertise', 'unread'
    ].forEach(checkPropertyExists(user))
  })

  context('associations', () => {
    const Question = 'Question'
    const Answer = 'Answer'
    const Notification = 'Notification'
    before(() => {
      User.associate({ Question })
      User.associate({ Answer })
      User.associate({ Notification })

    })
    it('should belong to question', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Question)
      done()
    })
    it('should belong to answer', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Answer)
      done()
    })
    it('should belong to notification', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Notification)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.User.create({}).then((user) => {
        data = user
        done()
      })
    })
    it('read', (done) => {
      db.User.findByPk(data.id).then((user) => {
        expect(user.id).to.be.equal(user.id)
        done()
      })
    })
    it('update', (done) => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.User.destroy({ where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })
})
