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
    role: 'admin',
    quantity: 1
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
  context('# POST /api/student/questions', () => {
    it('Post the question with enough quantity', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/student/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ description: 'test', subjectId: 1, scopeId: 1, StatusId: 1 })
      })
        .then(res => {
          assert.strictEqual(res.status, 200)
          return res.json()
        })
        .then(res => {
          assert.strictEqual(res.message, 'Post the question successfully!')
        })
    })
    it('Post the question without enough quantity', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/student/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ description: 'test2', subjectId: 2, scopeId: 2, StatusId: 1 })
      })
        .then(res => {
          assert.strictEqual(res.status, 200)
          return res.json()
        })
        .then(res => {
          assert.strictEqual(res.message, 'Insufficient balance, please recharge!')
        })
    })
  })

  context('# GET /api/student/questions', () => {
    it('get student questions successfully', async () => {
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
  })

  context('# GET /api/teacher/questions', () => {
    it('get teacher questions successfully', async () => {
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
  })
  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Question.destroy({ where: {}, truncate: true })
  })
})
