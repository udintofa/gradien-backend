const db = require('../config/database');

exports.createCourse = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "title wajib diisi" });
  }

  const [result] = await db.query(
    `INSERT INTO courses (title, description)
     VALUES (?, ?)`,
    [title, description]
  );

  res.status(201).json({
    message: "Course berhasil dibuat",
    course_id: result.insertId,
  });
};

exports.getAllCourses = async (req, res) => {
  const [rows] = await db.query(
    `SELECT id, title, description, created_at
     FROM courses
     ORDER BY created_at DESC`
  );

  res.json(rows);
};

exports.getCourseById = async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query(
    `SELECT *
     FROM courses
     WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Course tidak ditemukan" });
  }

  res.json(rows[0]);
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  await db.query(
    `UPDATE courses
     SET title = ?, description = ?
     WHERE id = ?`,
    [title, description, id]
  );

  res.json({ message: "Course berhasil diupdate" });
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  await db.query(
    `DELETE FROM courses WHERE id = ?`,
    [id]
  );

  res.json({ message: "Course berhasil dihapus" });
};