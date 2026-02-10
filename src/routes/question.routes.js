const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware')
const controller = require('../controllers/question.controller')

router.post('/tryouts/:tryoutId/questions', auth, controller.createQuestion)
router.get('/tryouts/:tryoutId/questions', auth, controller.getQuestionsByTryout)

module.exports = router