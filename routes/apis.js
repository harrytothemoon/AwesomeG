const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/adminController.js')
const answerController = require('../controllers/answerController.js')
const subjectController = require('../controllers/subjectController.js')
const scopeController = require('../controllers/scopeController.js')
const questionController = require('../controllers/questionController.js')
const userController = require('../controllers/userController.js')
const productController = require('../controllers/productController.js')
const orderController = require('../controllers/orderController.js')
const paymentController = require('../controllers/paymentController.js')
const notificationController = require('../controllers/notificationController.js')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      return next()
    } else {
      return res.json({ status: 'error', message: 'permission denied!' })
    }
  } else {
    return res.json({ status: 'error', message: 'permission denied!' })
  }
}
const authenticatedStudent = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'student' || req.user.role === 'admin') {
      return next()
    } else {
      return res.json({ status: 'error', message: "your account is not a student's account!" })
    }
  } else {
    return res.json({ status: 'error', message: 'permission denied!' })
  }
}
const authenticatedTeacher = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'teacher' || req.user.role === 'admin') {
      return next()
    } else {
      return res.json({ status: 'error', message: "your account is not a teacher's account!" })
    }
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)
router.get('/admin', (req, res) => res.redirect('/api/admin/users'))
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)

router.get('/scopes', scopeController.getScopes)
router.get('/admin/scopes/:id', scopeController.getScopes)
router.post('/admin/scopes', authenticated, authenticatedAdmin, scopeController.postScope)
router.put('/admin/scopes/:id', authenticated, authenticatedAdmin, scopeController.putScope)
router.delete('/admin/scopes/:id', authenticated, authenticatedAdmin, scopeController.deleteScope)
router.get('/subjects', subjectController.getSubjects)
router.get('/admin/subjects/:id', subjectController.getSubjects)
router.post('/admin/subjects', authenticated, authenticatedAdmin, subjectController.postSubject)
router.put('/admin/subjects/:id', authenticated, authenticatedAdmin, subjectController.putSubject)
router.delete('/admin/subjects/:id', authenticated, authenticatedAdmin, subjectController.deleteSubject)

router.get('/users/teachers', userController.getTeachers)
router.get('/get_current_user', authenticated, userController.getCurrentUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('avatar'), userController.putUser)

router.get('/teacher/questions', authenticated, authenticatedTeacher, questionController.getQuestions)
router.get('/teacher/answers', authenticated, authenticatedTeacher, answerController.getAnswer)
router.post('/teacher/answer', authenticated, authenticatedTeacher, answerController.postAnswer)
router.put('/teacher/answer', authenticated, authenticatedTeacher, upload.single('image'), answerController.putAnswer)


router.get('/student/questions', authenticated, authenticatedStudent, questionController.getMyQuestions)
router.post('/student/questions', authenticated, authenticatedStudent, upload.single('image'), questionController.postQuestion)

router.get('/products', productController.getProducts)
router.get('/admin/products/:id', authenticated, productController.getProducts)
router.post('/admin/products', authenticated, authenticatedAdmin, productController.postProduct)
router.put('/admin/products/:id', authenticated, authenticatedAdmin, productController.putProduct)
router.delete('/admin/products/:id', authenticated, authenticatedAdmin, productController.deleteProduct)

router.get("/student/orders", authenticated, authenticatedStudent, orderController.getOrders);
router.post("/student/order", authenticated, authenticatedStudent, upload.single(), orderController.postOrder);

router.get("/student/order/:id/payment", authenticated, authenticatedStudent, orderController.getPayment);
router.post("/spgateway/callback", paymentController.spgatewayCallback);

router.get('/notifications', authenticated, authenticatedStudent, notificationController.getNotifications)

module.exports = router