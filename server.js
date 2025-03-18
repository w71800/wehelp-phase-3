require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const listApi = require('./api/list.js')
const authApi = require('./api/auth.js')
const historyApi = require('./api/history.js')
const listsApi = require('./api/lists.js')
const messagesApi = require('./api/messages.js')
const graphDataApi = require('./api/graphData.js')

app.enable('trust proxy');

const corsOptions = {
  origin: '*',  // 或指定您的前端網域
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.static('dist'))

app.use("/api/list", listApi)
app.use("/api/auth", authApi)
app.use("/api/history", historyApi)
app.use("/api/lists", listsApi)
app.use("/api/messages", messagesApi)
app.use("/api/graphData", graphDataApi)

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html")
})

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html")
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});