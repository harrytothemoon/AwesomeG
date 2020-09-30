const bcrypt = require('bcryptjs')
const request = require('supertest')
const db = require('../../models')
const { User, Question } = db
const { expect } = require('chai')
const path = require("path")

const app = require('../../app')

describe('# Question Request', () => {
  let token = ''     // for saving sign in token
  const testAdmin = {
    name: 'test',
    email: 'test@example.com',
    password: 'test',
    role: 'admin',
    quantity: 2
  }
  before(async () => {
    await User.destroy({ where: {}, truncate: true })
    await Question.destroy({ where: {}, truncate: true })
    // create a test user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(testAdmin.password, salt)
    await User.create({
      name: testAdmin.name,
      email: testAdmin.email,
      password: hash,
      role: testAdmin.role,
      quantity: testAdmin.quantity
    })
    // sign in as test user   
    const res = await request(app)
      .post('/api/signin')
      .set({
        'Content-Type': 'application/json',
      })
      .send({
        email: testAdmin.email,
        password: testAdmin.password
      })
      .expect(200)
    token = res.body.token
  })
  context('# POST /api/student/questions', () => {
    it('Post the question without image and with enough quantity', async () => {
      const res = await request(app)
        .post('/api/student/questions')
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .send({
          description: 'test',
          subjectId: 1,
          scopeId: 1,
          StatusId: 1
        })
        .expect(200)

      expect(res.body.message).to.be.equal('Post the question successfully!')
    })

    it('Post the question with image and with enough quantity', async function () {
      this.timeout(10000)
      const res = await request(app)
        .post('/api/student/questions')
        .set({
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token
        })
        .field('subjectId', 1)
        .field('scopeId', 1)
        .field('StatusId', 1)
        .field('description', 'test')
        .attach('image', path.resolve(__dirname, "../../public/images.jpeg"))
        .expect(200)

      expect(res.body.message).to.be.equal('Post the question successfully!')
    })

    it('Post the question without enough quantity', async () => {
      const res = await request(app)
        .post('/api/student/questions')
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .send({
          description: 'test2',
          subjectId: 2,
          scopeId: 2,
          StatusId: 1
        })
        .expect(200)

      expect(res.body.message).to.be.equal('Insufficient balance, please recharge!')
    })
  })

  context('# GET /api/student/questions', () => {
    it('get student questions successfully', async () => {
      const res = await request(app)
        .get('/api/student/questions')
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .expect(200)

      expect(res.body.questions[0].description).to.be.equal('test')
    })
  })

  context('# GET /api/teacher/questions', () => {

    it('get teacher questions successfully', async () => {
      const res = await request(app)
        .get('/api/teacher/questions')
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .expect(200)

      expect(res.body.questions[0].description).to.be.equal('test')
    })
  })
  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Question.destroy({ where: {}, truncate: true })
  })
})
