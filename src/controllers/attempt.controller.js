const db = require('../config/database');
const { v4: uuid } = require('uuid');

/**
 * Helper: cek apakah waktu tryout habis
 */
async function isTimeUp(attemptId) {
  const [[row]] = await db.execute(
    `SELECT a.started_at, a.submitted_at, t.duration_minutes
     FROM attempts a
     JOIN tryouts t ON t.id = a.tryout_id
     WHERE a.id = ?`,
    [attemptId]
  );

  // kalau sudah submit, dianggap habis
  if (!row || row.submitted_at) return true;

  const endTime =
    new Date(row.started_at).getTime() +
    row.duration_minutes * 60 * 1000;

  return Date.now() > endTime;
}

/**
 * Helper: submit attempt (dipakai manual & auto)
 */
async function submitAttempt(attemptId) {
  // ambil jawaban user + cek benar
  const [answers] = await db.execute(
    `SELECT o.is_correct
     FROM answers a
     JOIN options o ON o.id = a.option_id
     WHERE a.attempt_id = ?`,
    [attemptId]
  );

  let score = 0;
  answers.forEach(a => {
    if (a.is_correct) score++;
  });

  await db.execute(
    `UPDATE attempts
     SET score = ?, submitted_at = NOW()
     WHERE id = ?`,
    [score, attemptId]
  );

  return score;
}

/**
 * START TRYOUT
 * POST /tryouts/:tryoutId/start
 */
exports.start = async (req, res) => {
  const userId = req.user.id;
  const { tryoutId } = req.params;

  try {
    // 🔒 cek attempt aktif
    const activeAttempt = await getActiveAttempt(userId, tryoutId);

    if (activeAttempt) {
      return res.status(409).json({
        message: 'You already have an active attempt',
        attempt_id: activeAttempt.id
      });
    }

    // ✅ bikin attempt baru
    const attemptId = uuid();

    await db.execute(
      `INSERT INTO attempts (id, user_id, tryout_id)
       VALUES (?, ?, ?)`,
      [attemptId, userId, tryoutId]
    );

    res.status(201).json({
      message: 'Tryout started',
      attempt_id: attemptId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * SAVE / UPDATE ANSWER (AUTOSAVE)
 * POST /attempts/:attemptId/answer
 */
exports.saveAnswer = async (req, res) => {
  const { attemptId } = req.params;
  const { question_id, option_id } = req.body;

  try {
    // ⏱️ cek waktu
    if (await isTimeUp(attemptId)) {
      await submitAttempt(attemptId);
      return res.status(403).json({
        message: 'Time is up. Tryout has been auto-submitted.'
      });
    }

    await db.execute(
      `INSERT INTO answers (attempt_id, question_id, option_id)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE option_id = VALUES(option_id)`,
      [attemptId, question_id, option_id]
    );

    res.json({ message: 'Answer saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET USER ANSWERS (RESUME)
 * GET /attempts/:attemptId/answers
 */
exports.getAnswers = async (req, res) => {
  const { attemptId } = req.params;

  try {
    if (await isTimeUp(attemptId)) {
      await submitAttempt(attemptId);
    }

    const [rows] = await db.execute(
      `SELECT question_id, option_id
       FROM answers
       WHERE attempt_id = ?`,
      [attemptId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * SUBMIT TRYOUT (MANUAL)
 * POST /attempts/:attemptId/submit
 */
exports.submit = async (req, res) => {
  const { attemptId } = req.params;

  try {
    const score = await submitAttempt(attemptId);

    res.json({
      message: 'Tryout submitted',
      score
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getActiveAttempt(userId, tryoutId) {
  const [[attempt]] = await db.execute(
    `SELECT a.id, a.started_at, t.duration_minutes
     FROM attempts a
     JOIN tryouts t ON t.id = a.tryout_id
     WHERE a.user_id = ?
       AND a.tryout_id = ?
       AND a.submitted_at IS NULL
     ORDER BY a.started_at DESC
     LIMIT 1`,
    [userId, tryoutId]
  );

  if (!attempt) return null;

  const endTime =
    new Date(attempt.started_at).getTime() +
    attempt.duration_minutes * 60 * 1000;

  // kalau waktu sudah habis → auto submit
  if (Date.now() > endTime) {
    await submitAttempt(attempt.id);
    return null;
  }

  return attempt;
}

/**
 * GET REMAINING TIME
 * GET /attempts/:attemptId/remaining-time
 */
exports.getRemainingTime = async (req, res) => {
  const { attemptId } = req.params;

  try {
    const [[row]] = await db.execute(
      `SELECT a.started_at, a.submitted_at, t.duration_minutes
       FROM attempts a
       JOIN tryouts t ON t.id = a.tryout_id
       WHERE a.id = ?`,
      [attemptId]
    );

    if (!row) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // kalau sudah submit → habis
    if (row.submitted_at) {
      return res.json({
        remaining_seconds: 0,
        is_time_up: true
      });
    }

    const endTime =
      new Date(row.started_at).getTime() +
      row.duration_minutes * 60 * 1000;

    const remainingMs = endTime - Date.now();
    const remainingSeconds = Math.max(
      Math.floor(remainingMs / 1000),
      0
    );

    // auto-submit kalau lewat
    if (remainingSeconds === 0) {
      await submitAttempt(attemptId);
      return res.json({
        remaining_seconds: 0,
        is_time_up: true
      });
    }

    res.json({
      remaining_seconds: remainingSeconds,
      is_time_up: false
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * GET TRYOUT RESULT
 * GET /attempts/:attemptId/result
 */
exports.getResult = async (req, res) => {
  const { attemptId } = req.params;
  const userId = req.user.id;

  try {
    // ambil attempt + tryout
    const [[attempt]] = await db.execute(
      `SELECT a.score, a.submitted_at, t.id AS tryout_id, t.title
       FROM attempts a
       JOIN tryouts t ON t.id = a.tryout_id
       WHERE a.id = ? AND a.user_id = ?`,
      [attemptId, userId]
    );

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (!attempt.submitted_at) {
      return res.status(403).json({ message: 'Tryout not submitted yet' });
    }

    // total soal
    const [[{ total_questions }]] = await db.execute(
      `SELECT COUNT(*) AS total_questions
       FROM questions
       WHERE tryout_id = ?`,
      [attempt.tryout_id]
    );

    // detail jawaban
    const [answers] = await db.execute(
      `SELECT
         q.id AS question_id,
         q.text AS question,
         q.explanation,
         q.video_url,
         o.id AS selected_option_id,
         o.text AS selected_option,
         o.is_correct
       FROM answers a
       JOIN questions q ON q.id = a.question_id
       JOIN options o ON o.id = a.option_id
       WHERE a.attempt_id = ?`,
      [attemptId]
    );

    res.json({
      tryout: {
        id: attempt.tryout_id,
        title: attempt.title
      },
      score: attempt.score,
      total_questions,
      submitted_at: attempt.submitted_at,
      answers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
