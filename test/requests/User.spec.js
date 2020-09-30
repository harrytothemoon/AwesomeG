const assert = require('assert')
const bcrypt = require('bcryptjs')
const fetch = require('node-fetch')
const HOST = process.env.HOST || 'http://localhost'
const INTERNAL_PORT = 3000
const db = require('../../models')
const { User } = db

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
      await fetch(`${HOST}:${INTERNAL_PORT}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testTeacher.name,
          password: testTeacher.password,
          passwordCheck: testTeacher.password
        })
      }).then(res => {
        assert.strictEqual(res.status, 400)
      })
    })

    it('get error when password settings are not consistent', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testTeacher.name,
          email: testTeacher.email,
          password: testTeacher.password,
          role: testTeacher.role,
          passwordCheck: `${testTeacher.password}error`
        })
      }).then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        assert.strictEqual(res.message, 'Password settings are not consistent.')
      })
    })

    it('sign up successfully', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testTeacher.name,
          email: testTeacher.email,
          role: testTeacher.role,
          password: testTeacher.password,
          passwordCheck: testTeacher.password
        })
      }).then(res => {
        assert.strictEqual(res.status, 200)
      })
    })

    it('get error when e-mail already exists', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testTeacher.name,
          email: testTeacher.email,
          role: testTeacher.role,
          password: testTeacher.password,
          passwordCheck: testTeacher.password
        })
      }).then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        assert.strictEqual(res.message, 'E-mail already exists')
      })
    })
  })

  context('# POST /api/signin', () => {
    it('get error when missing a field', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testTeacher.email,
          password: testTeacher.password,
        })
      }).then(res => {
        assert.strictEqual(res.status, 400)
      })
    })
    it('get error when fill in wrong email', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `${testTeacher.email}+err`,
          password: `${testTeacher.password}`,
        })
      }).then(res => {
        assert.strictEqual(res.status, 401)
      })
    })

    it('get error when fill in wrong password', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testTeacher.email,
          password: `${testTeacher.password}+err`,
        })
      }).then(res => {
        assert.strictEqual(res.status, 401)
      })
    })
    it('sign in successfully', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testTeacher.email,
          password: testTeacher.password,
        })
      }).then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        token = res.token
      })
    })
  })

  context('# GET /api/users/teachers', () => {
    it('get info successfully', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/users/teachers`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        assert.strictEqual(res.teachers[0].id, 1)
      })
    })
  })

  context('# GET /api/users/:id', () => {
    it('get error when params id not equal to sign in user', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/users/${2}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
      }).then(res => {
        assert.strictEqual(res.status, 401)
      })
    })
    it('get user info successfully', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/users/${1}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
      }).then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        assert.strictEqual(res.user.id, 1)
      })
    })
  })

  context('# PUT /api/users/:id', () => {
    it('get error when params id not equal to sign in user', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/users/${2}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
      }).then(res => {
        assert.strictEqual(res.status, 401)
      })
    })
    it('get error when password settings are not consistent', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/users/${1}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          password: testTeacher.password,
          passwordCheck: `${testTeacher.password}error`
        })
      }).then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        assert.strictEqual(res.message, 'Password settings are not consistent.')
      })
    })
    it('put user with password setting successfully', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/users/${1}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          name: 'puttest',
          password: 'puttest',
          passwordCheck: 'puttest',
        })
      }).then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        assert.strictEqual(res.message, 'Update Successfully!')
      })
    })
    it('put user without password setting successfully', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/users/${1}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          name: 'puttest',
        })
      }).then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        assert.strictEqual(res.message, 'Update Successfully!')
      })
    })
  })

  context('# GET /api/get_current_user', () => {
    it('get user info successfully', async () => {
      await fetch(`${HOST}:${INTERNAL_PORT}/api/get_current_user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
      }).then(res => {
        assert.strictEqual(res.status, 200)
        return res.json()
      }).then(res => {
        assert.strictEqual(res.user.id, 1)
      })
    })
  })

  after(async () => {
    // remove the test user
    await User.destroy({ where: {}, truncate: true })
  })
})