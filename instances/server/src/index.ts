import express from 'express'

const app = express()

app.use('/', (_req, res) => {
  res.send('Server GET')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('@struct/server starts on port: 3000')
})
