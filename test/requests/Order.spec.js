const bcrypt = require('bcryptjs')
const request = require('supertest')
const db = require('../../models')
const { Order, User, Product } = db
const { expect } = require('chai')

const app = require('../../app')

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

  it('POST /api/student/order', async () => {
    const res = await request(app)
      .post('/api/student/order')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .send({
        productId: 1,
        payment_status: 0,
        amount: testProduct.price
      })
      .expect(200)

    expect(res.body.message).to.be.equal('Place an order successfully!')
  })

  it('GET /api/student/orders', async () => {
    const res = await request(app)
      .get('/api/student/orders')
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.orders[0].UserId).to.be.equal(1)
  })

  it('GET /api/student/order/:id/payment', async () => {
    const res = await request(app)
      .get(`/api/student/order/${1}/payment`)
      .set({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
      .expect(200)

    expect(res.body.order.amount).to.be.equal(testProduct.price)
  })

  after(async () => {
    // remove the test
    await User.destroy({ where: {}, truncate: true })
    await Order.destroy({ where: {}, truncate: true })
    await Product.destroy({ where: {}, truncate: true })
  })
})
