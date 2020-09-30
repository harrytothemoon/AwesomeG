const bcrypt = require('bcryptjs')
const request = require('supertest')
const db = require('../../models')
const { Answer, User, Question } = db
const { expect } = require('chai')

const app = require('../../app')

describe('# Answer Request', () => {
  let token = ''     // for saving sign in token
  const testTeacher = {
    name: 'test',
    email: 'test@example.com',
    password: 'test',
    role: 'teacher'
  }
  const testQuestion = {
    description: 'test',
    UserId: '2',
  }
  before(async () => {
    await User.destroy({ where: {}, truncate: true })
    await Answer.destroy({ where: {}, truncate: true })
    await Question.destroy({ where: {}, truncate: true })
    // create a test user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(testTeacher.password, salt)
    await User.create({
      name: testTeacher.name,
      email: testTeacher.email,
      password: hash,
      role: testTeacher.role
    })
    await Question.create({
      description: testQuestion.description,
      UserId: testQuestion.UserId,
    })
    // sign in as test user   
    const res = await request(app)
      .post('/api/signin')
      .set({
        'Content-Type': 'application/json',
      })
      .send({
        email: testTeacher.email,
        password: testTeacher.password
      })
      .expect(200)
    token = res.body.token
  })

  it('POST /api/teacher/answer', async () => {
    const res = await request(app)
      .post('/api/teacher/answer')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .send({
        questionId: 1,
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Get the Question!')
  })

  it('PUT /api/teacher/answer', async () => {
    const res = await request(app)
      .put('/api/teacher/answer')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .send({
        questionId: 1,
        answer: 'test'
      })
      .expect(200)

    expect(res.body.message).to.be.equal('The answer has been sent!')
  })

  it('GET /api/teacher/answers', async () => {
    const res = await request(app)
      .get('/api/teacher/answers')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.answers[0].UserId).to.be.equal(1)
  })

  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Answer.destroy({ where: {}, truncate: true })
    await Question.destroy({ where: {}, truncate: true })
  })
})
