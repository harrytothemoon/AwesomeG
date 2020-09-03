const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const adminController = require('../controllers/adminController.js')
const answerController = require('../controllers/answerController.js')
const categoryController = require('../controllers/categoryController.js')
const questionController = require('../controllers/questionController.js')
const userController = require('../controllers/userController.js')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied!' })
  } else {
    return res.json({ status: 'error', message: 'permission denied!' })
  }
}
const authenticatedStudent = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'student') { return next() }
    return res.json({ status: 'error', message: "your account is not a student's account!" })
  } else {
    return res.json({ status: 'error', message: 'permission denied!' })
  }
}
const authenticatedTeacher = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'teacher') { return next() }
    return res.json({ status: 'error', message: "your account is not a teacher's account!" })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)
router.get('/admin', (req, res) => res.redirect('/api/admin/users'))
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/teacher/questions', questionController.getQuestions)

router.get('/student/questions', questionController.getMyQuestions)
router.post('/student/questions', questionController.postQuestion)

module.exports = router