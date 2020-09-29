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
const ScopeModel = require('../../models/scope')

describe('# Scope Model', () => {

  before(done => {
    done()
  })

  const Scope = ScopeModel(sequelize, dataTypes)
  const scope = new Scope()
  checkModelName(Scope)('Scope')

  context('properties', () => {
    ;[
      'name'
    ].forEach(checkPropertyExists(scope))
  })

  context('associations', () => {
    const Question = 'Question'
    before(() => {
      Scope.associate({ Question })
    })
    it('should has many question', (done) => {
      expect(Scope.hasMany).to.have.been.calledWith(Question)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Scope.create({}).then((scope) => {
        data = scope
        done()
      })
    })
    it('read', (done) => {
      db.Scope.findByPk(data.id).then((scope) => {
        expect(scope.id).to.be.equal(scope.id)
        done()
      })
    })
    it('update', (done) => {
      db.Scope.update({}, { where: { id: data.id } }).then(() => {
        db.Scope.findByPk(data.id).then((scope) => {
          expect(data.updatedAt).to.be.not.equal(scope.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Scope.destroy({ where: { id: data.id } }).then(() => {
        db.Scope.findByPk(data.id).then((scope) => {
          expect(scope).to.be.equal(null)
          done()
        })
      })
    })
  })
})
