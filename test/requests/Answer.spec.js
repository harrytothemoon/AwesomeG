const assert = require('assert')
const bcrypt = require('bcryptjs')
const fetch = require('node-fetch')
const HOST = process.env.HOST || 'http://localhost'
const INTERNAL_PORT = 3000
const db = require('../../models')
const { Answer, User, Question } = db

describe('# Answer request', () => {
  context('# After sign in', () => {
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
      await fetch(`${HOST}:${INTERNAL_PORT}/api/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testTeacher.email,
          password: testTeacher.password
        })
      })
        .then(res => res.json())
        .then(res => {
          token = res.token
        })
    })

    it('POST /api/teacher/answer', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/teacher/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ questionId: 1 })
      })
        .then(res => {
          assert.strictEqual(res.status, 200)
          return res.json()
        })
        .then(res => {
          assert.strictEqual(res.message, 'Get the Question!')
        })
    })

    it('PUT /api/teacher/answer', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/teacher/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ questionId: 1, answer: 'test' })
      })
        .then(res => {
          assert.strictEqual(res.status, 200)
          return res.json()
        })
        .then(res => {
          assert.strictEqual(res.message, 'The answer has been sent!')
        })
    })

    it('GET /api/teacher/answers', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/teacher/answers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        }
      })
        .then(res => {
          assert.strictEqual(res.status, 200)
          return res.json()
        }).then(res => {
          assert.strictEqual(res.answers[0].UserId, 1)
        })
    })

    after(async () => {
      // remove the test user and url
      await User.destroy({ where: {}, truncate: true })
      await Answer.destroy({ where: {}, truncate: true })
      await Question.destroy({ where: {}, truncate: true })
    })
  })
})
