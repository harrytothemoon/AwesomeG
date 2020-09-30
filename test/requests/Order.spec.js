const assert = require('assert')
const bcrypt = require('bcryptjs')
const fetch = require('node-fetch')
const HOST = process.env.HOST || 'http://localhost'
const INTERNAL_PORT = 3000
const db = require('../../models')
const { Order, User, Product } = db

describe('# Order Request', () => {
  let token = ''     // for saving sign in token
  const testStudent = {
    name: 'test',
    email: 'test@example.com',
    password: 'test',
    role: 'student'
  }
  const testProduct = {
    name: 'test',
    description: 'test',
    price: 123,
  }
  before(async () => {
    await User.destroy({ where: {}, truncate: true })
    await Order.destroy({ where: {}, truncate: true })
    await Product.destroy({ where: {}, truncate: true })
    // create a test user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(testStudent.password, salt)
    await User.create({
      name: testStudent.name,
      email: testStudent.email,
      password: hash,
      role: testStudent.role
    })
    await Product.create({
      description: testProduct.description,
      price: testProduct.price,
      name: testProduct.name
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

  it('POST /api/student/order', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/student/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ productId: 1, payment_status: 0, amount: testProduct.price })
    })
      .then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      })
      .then(res => {
        assert.strictEqual(res.message, 'Place an order successfully!')
      })
  })

  it('GET /api/student/orders', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/student/orders`, {
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
        assert.strictEqual(res.orders[0].UserId, 1)
      })
  })

  it('GET /api/student/order/:id/payment', async () => {
    await fetch(`${HOST}:${INTERNAL_PORT}/api/student/order/${1}/payment`, {
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
        assert.strictEqual(res.order.amount, testProduct.price)
      })
  })

  after(async () => {
    // remove the test
    await User.destroy({ where: {}, truncate: true })
    await Order.destroy({ where: {}, truncate: true })
    await Product.destroy({ where: {}, truncate: true })
  })
})
