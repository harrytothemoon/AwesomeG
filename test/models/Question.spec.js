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
const QuestionModel = require('../../models/question')

describe('# Question Model', () => {

  before(done => {
    done()
  })

  const Question = QuestionModel(sequelize, dataTypes)
  const question = new Question()
  checkModelName(Question)('Question')

  context('properties', () => {
    ;[
      'description', 'image', 'UserId', 'SubjectId', 'ScopeId', 'StatusId', 'AnswerId'
    ].forEach(checkPropertyExists(question))
  })

  context('associations', () => {
    const Status = 'Status'
    const Subject = 'Subject'
    const Scope = 'Scope'
    const User = 'User'
    const Answer = 'Answer'
    before(() => {
      Question.associate({ Status })
      Question.associate({ Subject })
      Question.associate({ Scope })
      Question.associate({ User })
      Question.associate({ Answer })
    })
    it('should belong to status', (done) => {
      expect(Question.belongsTo).to.have.been.calledWith(Status)
      done()
    })
    it('should belong to subject', (done) => {
      expect(Question.belongsTo).to.have.been.calledWith(Subject)
      done()
    })
    it('should belong to scope', (done) => {
      expect(Question.belongsTo).to.have.been.calledWith(Scope)
      done()
    })
    it('should belong to user', (done) => {
      expect(Question.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to answer', (done) => {
      expect(Question.belongsTo).to.have.been.calledWith(Answer)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Question.create({}).then((question) => {
        data = question
        done()
      })
    })
    it('read', (done) => {
      db.Question.findByPk(data.id).then((question) => {
        expect(question.id).to.be.equal(question.id)
        done()
      })
    })
    it('update', (done) => {
      db.Question.update({}, { where: { id: data.id } }).then(() => {
        db.Question.findByPk(data.id).then((question) => {
          expect(data.updatedAt).to.be.not.equal(question.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Question.destroy({ where: { id: data.id } }).then(() => {
        db.Question.findByPk(data.id).then((question) => {
          expect(question).to.be.equal(null)
          done()
        })
      })
    })
  })
})
