const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController.js')
const answerController = require('../controllers/answerController.js')
const categoryController = require('../controllers/categoryController.js')
const questionController = require('../controllers/questionController.js')
const userController = require('../controllers/userController.js')


router.get('/admin', (req, res) => res.redirect('/api/admin/users'))
router.get('/admin/users', adminController.getUsers)

module.exports = router