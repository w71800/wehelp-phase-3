const express = require("express")
const router = express.Router()
const mysql = require("mysql2")
const { Value } = require("sass")
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'project',
  connectionLimit: 10
})

const connection = pool.promise()

router.get("/", async (req, res)=>{
  let response = null
  try{
    let query = `SELECT * from lists`
    let [ row ] = await connection.query(query)
    
    response = { data: row[0] }
  }catch(e){
    response = { error: e }
  }

  res.json(response)
})

router.post("/", async (req, res)=>{
  let data = {
    date: "2023 / 11 / 05",
    part: "肩",
    items: [{
      "item": "深蹲（槓）",
      "sets": [
        {
          "times": 12,
          "load": 20,
          "unit": "kg",
          "rpe": 6
        },
        {
          "times": 12,
          "load": 20,
          "unit": "kg",
          "rpe": 8
        }
      ]
    },
    {
      "item": "硬舉（槓）",
      "sets": [
        {
          "times": 12,
          "load": 5,
          "unit": "kg",
          "rpe": 4
        },
        {
          "times": 12,
          "load": 7.5,
          "unit": "kg",
          "rpe": 6
        }
      ]
    }] // 用 JSON 格式存進資料庫中
  }
  let response = null
  try{
    let query = "INSERT INTO lists(date, part, items) values(?, ?, ?)"
    let values = [ data.date, data.part, JSON.stringify(data.items) ]
    let result = await connection.query(query, values)

    response = { ok: result }
  }catch(e){
    console.log(e);

    response = { error: e }
  }
  

  res.json(response)
})



module.exports = router

