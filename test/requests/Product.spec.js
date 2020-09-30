const bcrypt = require('bcryptjs')
const request = require('supertest')
const db = require('../../models')
const { User, Product } = db
const { expect } = require('chai')

const app = require('../../app')

describe('# Product Request', () => {
  let token = ''     // for saving sign in token
  const testAdmin = {
    name: 'test',
    email: 'test@example.com',
    password: 'test',
    role: 'admin'
  }
  before(async () => {
    await User.destroy({ where: {}, truncate: true })
    await Product.destroy({ where: {}, truncate: true })
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

  it('POST /api/admin/products', async () => {
    const res = await request(app)
      .post('/api/admin/products')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .send({
        name: 'test',
        description: 'test',
        price: 123
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Place the product successfully!')
  })

  it('GET /api/products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.products[0].name).to.be.equal('test')
  })

  it('PUT /api/admin/products/:id', async () => {
    const res = await request(app)
      .put(`/api/admin/products/${1}`)
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .send({
        name: 'puttest',
        description: 'puttest',
        price: 456
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Edit the product successfully!')
  })

  it('GET /api/admin/products/:id', async () => {
    const res = await request(app)
      .get(`/api/admin/products/${1}`)
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.product.name).to.be.equal('puttest')
  })

  it('DELETE /api/admin/products/:id', async () => {
    const res = await request(app)
      .delete(`/api/admin/products/${1}`)
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Remove the product successfully!')
  })

  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Product.destroy({ where: {}, truncate: true })
  })
})
