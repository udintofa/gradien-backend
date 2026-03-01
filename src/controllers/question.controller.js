const pool = require("../config/database");

exports.createQuestion = async (req, res) => {
  const { subtryoutId } = req.params;
  const { text, options, explanation, videoUrl } = req.body;

  if (!text || !options || options.length < 2) {
    return res.status(400).json({ message: "Soal dan opsi tidak valid" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO questions (sub_tryout_id, text, explanation, video_url)
       VALUES (?, ?, ?, ?)`,
      [subtryoutId, text, explanation || null, videoUrl || null],
    );

    const questionId = result.insertId;

    for (const option of options) {
      await connection.query(
        `INSERT INTO options (question_id, text, is_correct)
         VALUES (?, ?, ?)`,
        [questionId, option.text, option.isCorrect],
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Soal berhasil dibuat" });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

exports.getQuestionsBySubtryout = async (req, res) => {
  const { subtryoutId } = req.params;

  const [questions] = await pool.query(
    "SELECT * FROM questions WHERE sub_tryout_id = ?",
    [subtryoutId],
  );

  for (const q of questions) {
    const [options] = await pool.query(
      "SELECT id, text FROM options WHERE question_id = ?",
      [q.id],
    );
    q.options = options;
  }

  res.json(questions);
};

exports.updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { text, options, explanation, videoUrl } = req.body;

  if (!text || !options || options.length < 2) {
    return res.status(400).json({ message: "Soal dan opsi tidak valid" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Update question
    await connection.query(
      `UPDATE questions 
       SET text = ?, explanation = ?, video_url = ?
       WHERE id = ?`,
      [text, explanation || null, videoUrl || null, questionId],
    );

    // Hapus opsi lama
    await connection.query(`DELETE FROM options WHERE question_id = ?`, [
      questionId,
    ]);

    // Insert opsi baru
    for (const option of options) {
      await connection.query(
        `INSERT INTO options (question_id, text, is_correct)
         VALUES (?, ?, ?)`,
        [questionId, option.text, option.isCorrect],
      );
    }

    await connection.commit();
    res.json({ message: "Soal berhasil diupdate" });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

exports.deleteQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
    await pool.query(`DELETE FROM questions WHERE id = ?`, [questionId]);

    res.json({ message: "Soal berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
