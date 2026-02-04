const db = require("../config/database");

exports.createTryout = async (req, res) => {
  const { course_id, title, description, duration_minutes } = req.body;

  if (!course_id || !title || !duration_minutes) {
    return res.status(400).json({
      message: "course_id, title, dan duration_minutes wajib",
    });
  }

  const [result] = await db.query(
    `INSERT INTO tryouts (course_id, title, description, duration_minutes)
     VALUES (?, ?, ?, ?)`,
    [course_id, title, description, duration_minutes]
  );

  res.status(201).json({
    message: "Tryout berhasil dibuat",
    tryout_id: result.insertId,
  });
};

exports.getTryoutsByCourse = async (req, res) => {
  const { courseId } = req.params;

  const [rows] = await db.query(
    `SELECT id, title, description, duration_minutes, created_at
     FROM tryouts
     WHERE course_id = ?
     ORDER BY created_at ASC`,
    [courseId]
  );

  res.json(rows);
};

exports.getTryoutById = async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query(
    `SELECT *
     FROM tryouts
     WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      message: "Tryout tidak ditemukan",
    });
  }

  res.json(rows[0]);
};

exports.updateTryout = async (req, res) => {
  const { id } = req.params;
  const { title, description, duration_minutes } = req.body;

  await db.query(
    `UPDATE tryouts
     SET title = ?, description = ?, duration_minutes = ?
     WHERE id = ?`,
    [title, description, duration_minutes, id]
  );

  res.json({
    message: "Tryout berhasil diupdate",
  });
};

exports.deleteTryout = async (req, res) => {
  const { id } = req.params;

  await db.query(
    `DELETE FROM tryouts WHERE id = ?`,
    [id]
  );

  res.json({
    message: "Tryout berhasil dihapus",
  });
};
