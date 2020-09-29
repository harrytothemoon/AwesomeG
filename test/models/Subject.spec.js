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
const SubjectModel = require('../../models/subject')

describe('# Subject Model', () => {

  before(done => {
    done()
  })

  const Subject = SubjectModel(sequelize, dataTypes)
  const subject = new Subject()
  checkModelName(Subject)('Subject')

  context('properties', () => {
    ;[
      'name'
    ].forEach(checkPropertyExists(subject))
  })

  context('associations', () => {
    const Question = 'Question'
    before(() => {
      Subject.associate({ Question })
    })
    it('should has many question', (done) => {
      expect(Subject.hasMany).to.have.been.calledWith(Question)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Subject.create({}).then((subject) => {
        data = subject
        done()
      })
    })
    it('read', (done) => {
      db.Subject.findByPk(data.id).then((subject) => {
        expect(subject.id).to.be.equal(subject.id)
        done()
      })
    })
    it('update', (done) => {
      db.Subject.update({}, { where: { id: data.id } }).then(() => {
        db.Subject.findByPk(data.id).then((subject) => {
          expect(data.updatedAt).to.be.not.equal(subject.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Subject.destroy({ where: { id: data.id } }).then(() => {
        db.Subject.findByPk(data.id).then((subject) => {
          expect(subject).to.be.equal(null)
          done()
        })
      })
    })
  })
})
