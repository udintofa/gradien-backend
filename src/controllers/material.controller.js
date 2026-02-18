const db = require("../config/database");

exports.createMaterial = async (req, res) => {
  const materials = req.body;

  // body harus array
  if (!Array.isArray(materials) || materials.length === 0) {
    return res.status(400).json({
      message: "Body harus berupa array dan tidak boleh kosong",
    });
  }

  const values = [];

  for (let i = 0; i < materials.length; i++) {
    const { course_id, title, content, video_url } = materials[i];

    // validasi semua wajib
    if (!course_id || !title || !content || !video_url) {
      return res.status(400).json({
        message: `Data ke-${i + 1} tidak lengkap. Semua field wajib diisi`,
      });
    }

    values.push([course_id, title, content, video_url]);
  }

  try {
    await db.query(
      `INSERT INTO materials (course_id, title, content, video_url)
       VALUES ?`,
      [values]
    );

    res.status(201).json({
      message: `${values.length} material berhasil ditambahkan`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Gagal menyimpan material",
    });
  }
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