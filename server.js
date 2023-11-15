const express = require('express')
const app = express()
const cors = require('cors')
const listApi = require('./api/list.js')
const authApi = require('./api/auth.js')
const historyApi = require('./api/history.js')


app.use(express.static('dist'))
app.use(cors())
app.use("/api/list", listApi)
app.use("/api/auth", authApi)
app.use("/api/history", historyApi)


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html")
})





app.listen(3000)