const assert = require('assert')
const bcrypt = require('bcryptjs')
const fetch = require('node-fetch')
const HOST = process.env.HOST || 'http://localhost'
const INTERNAL_PORT = 3000
const db = require('../../models')
const { User, Question } = db

describe('# Question Request', () => {
  let token = ''     // for saving sign in token
  const testAdmin = {
    name: 'test',
    email: 'test@example.com',
    password: 'test',
    role: 'admin'
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
      quantity: 1
    })
    // sign in as test user   
    await fetch(`${HOST}:${INTERNAL_PORT}/api/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testAdmin.email,
        password: testAdmin.password
      })
    })
      .then(res => res.json())
      .then(res => {
        token = res.token
      })
  })

  it('POST /api/student/questions', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/student/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ description: 'test', subjectId: 1, scopeId: 1 })
    })
      .then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      })
      .then(res => {
        assert.strictEqual(res.message, 'Post the question successfully!')
      })
  })

  it('GET /api/student/questions', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/student/questions`, {
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
        assert.strictEqual(res.questions[0].description, 'test')
      })
  })

  it('GET /api/teacher/questions', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/teacher/questions`, {
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
        assert.strictEqual(res.questions[0].description, 'test')
      })
  })
  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Question.destroy({ where: {}, truncate: true })
  })
})
