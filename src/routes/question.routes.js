const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const controller = require('../controllers/question.controller')

router.post('/', auth, controller.createQuestion)
router.get('/', auth, controller.getQuestions)

module.exports = router