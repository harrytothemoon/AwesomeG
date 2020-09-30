const bcrypt = require('bcryptjs')
const request = require('supertest')
const db = require('../../models')
const { User, Scope } = db
const { expect } = require('chai')

const app = require('../../app')

describe('# Scope Request', () => {
  let token = ''     // for saving sign in token
  const testAdmin = {
    name: 'test',
    email: 'test@example.com',
    password: 'test',
    role: 'admin'
  }
  before(async () => {
    await User.destroy({ where: {}, truncate: true })
    await Scope.destroy({ where: {}, truncate: true })
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

  it('POST /api/admin/scopes', async () => {
    const res = await request(app)
      .post('/api/admin/scopes')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .send({
        name: 'test',
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Create the scope successfully!')
  })

  it('GET /api/scopes', async () => {
    const res = await request(app)
      .get('/api/scopes')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.scopes[0].name).to.be.equal('test')
  })

  it('PUT /api/admin/scopes/:id', async () => {
    const res = await request(app)
      .put(`/api/admin/scopes/${1}`)
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .send({
        name: 'puttest',
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Edit the scope successfully!')
  })

  it('GET /api/admin/scopes/:id', async () => {
    const res = await request(app)
      .get(`/api/admin/scopes/${1}`)
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.scope.name).to.be.equal('puttest')
  })

  it('DELETE /api/admin/scopes/:id', async () => {
    const res = await request(app)
      .delete(`/api/admin/scopes/${1}`)
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Remove the scope successfully!')
  })

  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Scope.destroy({ where: {}, truncate: true })
  })
})
