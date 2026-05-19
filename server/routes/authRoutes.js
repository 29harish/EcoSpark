const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/create', authController.createUser)
router.get('/user/:firebaseUid', authController.getUser)

module.exports = router