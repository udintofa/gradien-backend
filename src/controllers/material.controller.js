const db = require("../config/database");

exports.createMaterial = async (req, res) => {
  const { course_id, title, content, video_url } = req.body;

  if (!course_id || !title) {
    return res.status(400).json({
      message: "course_id dan title wajib diisi",
    });
  }

  const [result] = await db.query(
    `INSERT INTO materials (course_id, title, content, video_url)
     VALUES (?, ?, ?, ?)`,
    [course_id, title, content, video_url]
  );

  res.status(201).json({
    message: "Material berhasil dibuat",
    material_id: result.insertId,
  });
};

exports.getMaterialsByCourse = async (req, res) => {
  const { courseId } = req.params;

  const [rows] = await db.query(
    `SELECT id, title, created_at
     FROM materials
     WHERE course_id = ?
     ORDER BY created_at ASC`,
    [courseId]
  );

  res.json(rows);
};

exports.getMaterialById = async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query(
    `SELECT *
     FROM materials
     WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      message: "Material tidak ditemukan",
    });
  }

  res.json(rows[0]);
};

exports.updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { title, content, video_url } = req.body;

  await db.query(
    `UPDATE materials
     SET title = ?, content = ?, video_url = ?
     WHERE id = ?`,
    [title, content, video_url, id]
  );

  res.json({
    message: "Material berhasil diupdate",
  });
};

exports.deleteMaterial = async (req, res) => {
  const { id } = req.params;

  await db.query(
    `DELETE FROM materials WHERE id = ?`,
    [id]
  );

  res.json({
    message: "Material berhasil dihapus",
  });
};
