const router = require('express').Router();
const attempt = require('../controllers/attempt.controller');
const auth = require('../middlewares/auth.middleware');

// start tryout
router.post('/tryouts/:tryoutId/start', auth, attempt.start);

// autosave answer
router.post('/attempts/:attemptId/answer', auth, attempt.saveAnswer);

// ambil jawaban user (resume)
router.get('/attempts/:attemptId/answers', auth, attempt.getAnswers);

// submit tryout
router.post('/attempts/:attemptId/submit', auth, attempt.submit);

router.get('/attempts/:attemptId/remaining-time', auth, attempt.getRemainingTime);

router.get('/attempts/:attemptId/result', auth, attempt.getResult);

module.exports = router;
