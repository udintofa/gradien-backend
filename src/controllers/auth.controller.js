const pool = require('../config/database')
const jwt = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../utils/hash')
const { v4: uuidv4 } = require('uuid')

exports.register = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' })
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    )

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Username sudah digunakan' })
    }

    const passwordHash = await hashPassword(password)

    await pool.query(
      'INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)',
      [uuidv4(), username, passwordHash]
    )

    res.status(201).json({ message: 'Register berhasil' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' })
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, password_hash FROM users WHERE username = ?',
      [username]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const user = rows[0]
    const isMatch = await comparePassword(password, user.password_hash)

    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
