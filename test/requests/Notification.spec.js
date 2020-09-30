const assert = require('assert')
const bcrypt = require('bcryptjs')
const fetch = require('node-fetch')
const HOST = process.env.HOST || 'http://localhost'
const INTERNAL_PORT = 3000
const db = require('../../models')
const { User, Notification } = db

describe('# Notification request', () => {
  let token = ''     // for saving sign in token
  const testStudent = {
    name: 'test',
    email: 'test@example.com',
    password: 'test',
    role: 'student'
  }
  const testNotification = {
    msg: 'test',
    UserId: '1',
  }
  before(async () => {
    await User.destroy({ where: {}, truncate: true })
    await Notification.destroy({ where: {}, truncate: true })
    // create a test user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(testStudent.password, salt)
    await User.create({
      name: testStudent.name,
      email: testStudent.email,
      password: hash,
      role: testStudent.role
    })
    await Notification.create({
      msg: testNotification.msg,
      UserId: testNotification.UserId,
    })
    // sign in as test user   
    await fetch(`${HOST}:${INTERNAL_PORT}/api/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testStudent.email,
        password: testStudent.password
      })
    })
      .then(res => res.json())
      .then(res => {
        token = res.token
      })
  })

  it('GET /api/notifications', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/notifications`, {
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
        assert.strictEqual(res.notifications[0].msg, 'test')
      })
  })

  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Notification.destroy({ where: {}, truncate: true })
  })
})
