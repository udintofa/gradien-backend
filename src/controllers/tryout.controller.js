const db = require("../config/database");

exports.createTryout = async (req, res) => {
  const tryouts = req.body;

  // harus array
  if (!Array.isArray(tryouts) || tryouts.length === 0) {
    return res.status(400).json({
      message: "Body harus berupa array dan tidak boleh kosong",
    });
  }

  const values = [];

  for (let i = 0; i < tryouts.length; i++) {
    const { course_id, title, description, duration_minutes } = tryouts[i];

    // semua wajib diisi
    if (!course_id || !title || !description || !duration_minutes) {
      return res.status(400).json({
        message: `Data ke-${i + 1} tidak lengkap. Semua field wajib diisi`,
      });
    }

    // validasi tambahan (biar gak aneh-aneh)
    if (duration_minutes <= 0) {
      return res.status(400).json({
        message: `Data ke-${i + 1} duration_minutes harus lebih dari 0`,
      });
    }

    values.push([course_id, title, description, duration_minutes]);
  }

  try {
    await db.query(
      `INSERT INTO tryouts (course_id, title, description, duration_minutes)
       VALUES ?`,
      [values]
    );

    res.status(201).json({
      message: `${values.length} tryout berhasil dibuat`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal membuat tryout",
    });
  }
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
