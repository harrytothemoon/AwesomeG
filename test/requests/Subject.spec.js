const bcrypt = require('bcryptjs')
const request = require('supertest')
const db = require('../../models')
const { User, Subject } = db
const { expect } = require('chai')

const app = require('../../app')

describe('# Subject Request', () => {
  let token = ''     // for saving sign in token
  const testAdmin = {
    name: 'test',
    email: 'test@example.com',
    password: 'test',
    role: 'admin'
  }
  before(async () => {
    await User.destroy({ where: {}, truncate: true })
    await Subject.destroy({ where: {}, truncate: true })
    // create a test user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(testAdmin.password, salt)
    await User.create({
      name: testAdmin.name,
      email: testAdmin.email,
      password: hash,
      role: testAdmin.role
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

  it('POST /api/admin/subjects', async () => {
    const res = await request(app)
      .post('/api/admin/subjects')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .send({
        name: 'test',
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Create the subject successfully!')
  })

  it('GET /api/subjects', async () => {
    const res = await request(app)
      .get('/api/subjects')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.subjects[0].name).to.be.equal('test')
  })

  it('PUT /api/admin/subjects/:id', async () => {
    const res = await request(app)
      .put(`/api/admin/subjects/${1}`)
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .send({
        name: 'puttest',
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Edit the subject successfully!')
  })

  it('GET /api/admin/subjects/:id', async () => {
    const res = await request(app)
      .get(`/api/admin/subjects/${1}`)
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.subject.name).to.be.equal('puttest')
  })

  it('DELETE /api/admin/subjects/:id', async () => {
    const res = await request(app)
      .delete(`/api/admin/subjects/${1}`)
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Remove the subject successfully!')
  })

  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Subject.destroy({ where: {}, truncate: true })
  })
})
