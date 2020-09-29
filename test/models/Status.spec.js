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
const StatusModel = require('../../models/status')

describe('# Status Model', () => {

  before(done => {
    done()
  })

  const Status = StatusModel(sequelize, dataTypes)
  const status = new Status()
  checkModelName(Status)('Status')

  context('properties', () => {
    ;[
      'name'
    ].forEach(checkPropertyExists(status))
  })

  context('associations', () => {
    const Question = 'Question'
    before(() => {
      Status.associate({ Question })
    })
    it('should has many question', (done) => {
      expect(Status.hasMany).to.have.been.calledWith(Question)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Status.create({}).then((status) => {
        data = status
        done()
      })
    })
    it('read', (done) => {
      db.Status.findByPk(data.id).then((status) => {
        expect(status.id).to.be.equal(status.id)
        done()
      })
    })
    it('update', (done) => {
      db.Status.update({}, { where: { id: data.id } }).then(() => {
        db.Status.findByPk(data.id).then((status) => {
          expect(data.updatedAt).to.be.not.equal(status.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Status.destroy({ where: { id: data.id } }).then(() => {
        db.Status.findByPk(data.id).then((status) => {
          expect(status).to.be.equal(null)
          done()
        })
      })
    })
  })
})
