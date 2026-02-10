const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const questionRoutes = require('./routes/question.routes')
const courseRoutes = require("./routes/course.routes")
const materialRoutes = require("./routes/material.routes")
const tryoutRoutes = require("./routes/tryout.routes")
const attemptRoutes = require("./routes/attempt.routes")

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/tryouts", tryoutRoutes);
app.use("/api/attempts", attemptRoutes);



app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

module.exports = app