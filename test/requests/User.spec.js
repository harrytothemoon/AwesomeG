const request = require('supertest')
const db = require('../../models')
const { User } = db
const { expect } = require('chai')
const path = require("path")

const app = require('../../app')

describe('# User Request', () => {
  let token = ''     // for saving sign in token
  const testTeacher = {
    name: 'test',
    email: 'test@example.com',
    password: 'test',
    role: 'teacher'
  }
  before(async () => {
    await User.destroy({ where: {}, truncate: true })
  })
  context('# POST /api/signup', () => {
    it('get error when missing a field', async () => {
      await request(app)
        .post('/api/signup')
        .set({
          'Content-Type': 'application/json'
        })
        .send({
          name: testTeacher.name,
          password: testTeacher.password,
          passwordCheck: testTeacher.password
        })
        .expect(400)
    })

    it('get error when password settings are not consistent', async () => {
      const res = await request(app)
        .post('/api/signup')
        .set({
          'Content-Type': 'application/json'
        })
        .send({
          name: testTeacher.name,
          email: testTeacher.email,
          password: testTeacher.password,
          role: testTeacher.role,
          passwordCheck: `${testTeacher.password}error`
        })
        .expect(200)
      expect(res.body.message).to.be.equal('Password settings are not consistent.')
    })

    it('sign up successfully', async () => {
      await request(app)
        .post('/api/signup')
        .set({
          'Content-Type': 'application/json'
        })
        .send({
          name: testTeacher.name,
          email: testTeacher.email,
          role: testTeacher.role,
          password: testTeacher.password,
          passwordCheck: testTeacher.password
        })
        .expect(200)
    })

    it('get error when e-mail already exists', async () => {
      const res = await request(app)
        .post('/api/signup')
        .set({
          'Content-Type': 'application/json'
        })
        .send({
          name: testTeacher.name,
          email: testTeacher.email,
          role: testTeacher.role,
          password: testTeacher.password,
          passwordCheck: testTeacher.password
        })
        .expect(200)

      expect(res.body.message).to.be.equal('E-mail already exists')
    })
  })

  context('# POST /api/signin', () => {
    it('get error when missing a field', async () => {
      await request(app)
        .post('/api/signin')
        .set({
          'Content-Type': 'application/json'
        })
        .expect(400)
    })
    it('get error when fill in wrong email', async () => {
      await request(app)
        .post('/api/signin')
        .set({
          'Content-Type': 'application/json'
        })
        .send({
          email: `${testTeacher.email}+err`,
          password: `${testTeacher.password}`,
        })
        .expect(401)
    })

    it('get error when fill in wrong password', async () => {
      await request(app)
        .post('/api/signin')
        .set({
          'Content-Type': 'application/json'
        })
        .send({
          email: testTeacher.email,
          password: `${testTeacher.password}+err`,
        })
        .expect(401)
    })
    it('sign in successfully', async () => {
      const res = await request(app)
        .post('/api/signin')
        .set({
          'Content-Type': 'application/json'
        })
        .send({
          email: testTeacher.email,
          password: testTeacher.password,
        })
        .expect(200)
      token = res.body.token
    })
  })

  context('# GET /api/users/teachers', () => {
    it('get info successfully', async () => {
      const res = await request(app)
        .get('/api/users/teachers')
        .set({
          'Content-Type': 'application/json',
        })
        .expect(200)

      expect(res.body.teachers[0].id).to.be.equal(1)
    })
  })

  context('# GET /api/users/:id', () => {
    it('get error when params id not equal to sign in user', async () => {
      await request(app)
        .get(`/api/users/${2}`)
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .expect(401)
    })
    it('get user info successfully', async () => {
      const res = await request(app)
        .get(`/api/users/${1}`)
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .expect(200)

      expect(res.body.user.id).to.be.equal(1)
    })
  })

  context('# PUT /api/users/:id', () => {
    it('get error when params id not equal to sign in user', async () => {
      await request(app)
        .put(`/api/users/${2}`)
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .expect(401)
    })
    it('get error when password settings are not consistent', async () => {
      const res = await request(app)
        .put(`/api/users/${1}`)
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .send({
          password: testTeacher.password,
          passwordCheck: `${testTeacher.password}error`
        })
        .expect(200)

      expect(res.body.message).to.be.equal('Password settings are not consistent.')
    })
    it('put user with password setting successfully', async () => {
      const res = await request(app)
        .put(`/api/users/${1}`)
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .send({
          name: 'puttest',
          password: 'puttest',
          passwordCheck: 'puttest',
        })
        .expect(200)

      expect(res.body.message).to.be.equal('Update Successfully!')
    })
    it('put user with password setting and with avatar successfully', async function () {
      this.timeout(10000)
      const res = await request(app)
        .put(`/api/users/${1}`)
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .field('name', 'puttest')
        .field('password', 'puttest')
        .field('passwordCheck', 'puttest')
        .attach('avatar', path.resolve(__dirname, "../../public/images.jpeg"))
        .expect(200)

      expect(res.body.message).to.be.equal('Update Successfully!')
    })
    it('put user without password setting successfully', async () => {
      const res = await request(app)
        .put(`/api/users/${1}`)
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .send({
          name: 'puttest',
        })
        .expect(200)

      expect(res.body.message).to.be.equal('Update Successfully!')
    })
    it('put user without password setting and with avatar successfully', async function () {
      this.timeout(10000)
      const res = await request(app)
        .put(`/api/users/${1}`)
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .field('name', 'puttest')
        .attach('avatar', path.resolve(__dirname, "../../public/images.jpeg"))
        .expect(200)

      expect(res.body.message).to.be.equal('Update Successfully!')
    })
  })

  context('# GET /api/get_current_user', () => {
    it('get user info successfully', async () => {
      const res = await request(app)
        .get('/api/get_current_user')
        .set({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
        .expect(200)

      expect(res.body.user.id).to.be.equal(1)
    })
  })

  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
  })
})