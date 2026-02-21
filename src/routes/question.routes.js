const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.middleware')
const authorize = require('../middlewares/role.middleware')
const controller = require('../controllers/question.controller')


// Public
router.get(
    '/tryouts/:tryoutId/questions',
    auth,
    controller.getQuestionsByTryout
);

// Protected
router.post(
    '/tryouts/:tryoutId/questions',
    auth,
    authorize,
    controller.createQuestion
);

module.exports = router