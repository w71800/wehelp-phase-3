const express = require('express')
const app = express()
const listApi = require('./api/list.js')

app.use(express.static('dist'))
app.use("/api/list", listApi)


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html")
})





app.listen(3000)