const assert = require('assert')
const bcrypt = require('bcryptjs')
const fetch = require('node-fetch')
const HOST = process.env.HOST || 'http://localhost'
const INTERNAL_PORT = 3000
const db = require('../../models')
const { User, Product } = db

describe('# Answer Request', () => {
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

  it('POST /api//admin/products', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api//admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ name: 'test', description: 'test', price: 123 })
    })
      .then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      })
      .then(res => {
        assert.strictEqual(res.message, 'Place an product successfully!')
      })
  })

  it('GET /api/products', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/products`, {
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
        assert.strictEqual(res.products[0].name, 'test')
      })
  })

  it('PUT /api/admin/products/:id', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/admin/products/${1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ name: 'puttest', description: 'puttest', price: 456 })
    })
      .then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      })
      .then(res => {
        assert.strictEqual(res.message, 'Edit an product successfully!')
      })
  })

  it('GET /api/admin/products/:id', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/admin/products/${1}`, {
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
        assert.strictEqual(res.product.name, 'puttest')
      })
  })

  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
    await Product.destroy({ where: {}, truncate: true })
  })
})
