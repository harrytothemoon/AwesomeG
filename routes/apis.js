const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

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
    if (req.user.role === 'student' || req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: "your account is not a student's account!" })
  } else {
    return res.json({ status: 'error', message: 'permission denied!' })
  }
}
const authenticatedTeacher = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'teacher' || req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: "your account is not a teacher's account!" })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)
router.get('/admin', (req, res) => res.redirect('/api/admin/users'))
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)

router.get('/users/teachers', userController.getTeachers)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('avatar'), userController.putUser)

router.get('/teacher/questions', authenticated, questionController.getQuestions)
router.get('/teacher/answers', authenticated, answerController.getAnswer)
router.post('/teacher/answer', authenticated, answerController.postAnswer)
router.put('/teacher/answer', authenticated, upload.single('image'), answerController.putAnswer)


router.get('/student/questions', authenticated, questionController.getMyQuestions)
router.post('/student/questions', authenticated, upload.single('image'), questionController.postQuestion)

module.exports = router