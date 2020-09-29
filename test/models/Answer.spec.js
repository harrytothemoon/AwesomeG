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
const AnswerModel = require('../../models/answer')

describe('# Answer Model', () => {

  before(done => {
    done()
  })

  const Answer = AnswerModel(sequelize, dataTypes)
  const answer = new Answer()
  checkModelName(Answer)('Answer')

  context('properties', () => {
    ;[
      'answer', 'image', 'UserId', 'QuestionId'
    ].forEach(checkPropertyExists(answer))
  })

  context('associations', () => {
    const User = 'User'
    const Question = 'Question'
    before(() => {
      Answer.associate({ User })
      Answer.associate({ Question })
    })

    it('should belong to user', (done) => {
      expect(Answer.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to question', (done) => {
      expect(Answer.belongsTo).to.have.been.calledWith(Question)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Answer.create({}).then((answer) => {
        data = answer
        done()
      })
    })
    it('read', (done) => {
      db.Answer.findByPk(data.id).then((answer) => {
        expect(answer.id).to.be.equal(answer.id)
        done()
      })
    })
    it('update', (done) => {
      db.Answer.update({}, { where: { id: data.id } }).then(() => {
        db.Answer.findByPk(data.id).then((answer) => {
          expect(data.updatedAt).to.be.not.equal(answer.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Answer.destroy({ where: { id: data.id } }).then(() => {
        db.Answer.findByPk(data.id).then((answer) => {
          expect(answer).to.be.equal(null)
          done()
        })
      })
    })
  })
})
