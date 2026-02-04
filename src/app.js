const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const questionRoutes = require('./routes/question.routes')


const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/questions', questionRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

module.exports = app