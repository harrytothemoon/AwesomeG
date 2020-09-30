const bcrypt = require('bcryptjs')
const request = require('supertest')
const db = require('../../models')
const { User, Notification } = db
const { expect } = require('chai')

const app = require('../../app')

describe('# Notification Request', () => {
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
    const res = await request(app)
      .post('/api/signin')
      .set({
        'Content-Type': 'application/json',
      })
      .send({
        email: testStudent.email,
        password: testStudent.password
      })
      .expect(200)
    token = res.body.token
  })

  it('GET /api/notifications', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.notifications[0].msg).to.be.equal('test')
  })

  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Notification.destroy({ where: {}, truncate: true })
  })
})
