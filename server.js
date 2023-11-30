const express = require('express')
const app = express()
const cors = require('cors')
const listApi = require('./api/list.js')
const authApi = require('./api/auth.js')
const historyApi = require('./api/history.js')
const listsApi = require('./api/lists.js')
const messagesApi = require('./api/messages.js')
const graphDataApi = require('./api/graphData.js')


app.use(express.static('dist'))
app.use(cors())
app.use("/api/list", listApi)
app.use("/api/auth", authApi)
app.use("/api/history", historyApi)
app.use("/api/lists", listsApi)
app.use("/api/messages", messagesApi)
app.use("/api/graphData", graphDataApi)

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html")
})

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html")
})




app.listen(3000)