const db = require("../config/database");

/**
 * GET ALL SUBTRYOUTS BY TRYOUT ID
 */
exports.getSubtryoutsByTryout = async (req, res) => {
  try {
    const { tryoutId } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM subtryouts 
       WHERE tryout_id = ? 
       ORDER BY order_number ASC`,
      [tryoutId],
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error getSubtryoutsByTryout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET SINGLE SUBTRYOUT BY ID
 */
exports.getSubtryoutById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`SELECT * FROM subtryouts WHERE id = ?`, [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Subtryout not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error getSubtryoutById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * CREATE SUBTRYOUT
 */
exports.createSubtryout = async (req, res) => {
  try {
    const { tryout_id, title, description, duration, order_number } = req.body;

    if (!tryout_id || !title || !description || !duration || !order_number) {
      return res.status(400).json({ message: "Semua wajib diisi" });
    }

    await db.query(
      `INSERT INTO subtryouts 
       (tryout_id, title, description, duration, order_number)
       VALUES (?, ?, ?, ?, ?)`,
      [tryout_id, title, description, duration, order_number],
    );

    return res.status(201).json({
      message: "Subtryout berhasil dibuat",
    });
  } catch (error) {
    console.error("Error createSubtryout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * UPDATE SUBTRYOUT
 */
exports.updateSubtryout = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, order_number } = req.body;

    const [result] = await db.query(
      `UPDATE subtryouts
       SET title = ?, description = ?, duration = ?, order_number = ?
       WHERE id = ?`,
      [title, description, duration, order_number, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subtryout not found" });
    }

    return res.status(200).json({ message: "Subtryout updated successfully" });
  } catch (error) {
    console.error("Error updateSubtryout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE SUBTRYOUT
 */
exports.deleteSubtryout = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(`DELETE FROM subtryouts WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subtryout not found" });
    }

    return res.status(200).json({ message: "Subtryout deleted successfully" });
  } catch (error) {
    console.error("Error deleteSubtryout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
