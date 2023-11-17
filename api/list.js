const express = require("express")
const router = express.Router()
const mysql = require("mysql2")
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'project',
  connectionLimit: 10
})

const connection = pool.promise()
router.use(express.json())


router.get("/", async (req, res)=>{
  let response = null
  try{
    let query = `SELECT * from lists`
    let [ row ] = await connection.query(query)
    
    response = { data: row[1] }
  }catch(e){
    response = { error: e }
  }

  res.json(response)
})

router.post("/", async (req, res)=>{
  let data = req.body
  
  let response = null
  try{
    let query = `INSERT INTO lists(user_id, date, part, items) values(?, ?, ?, ?)`
    let values = [data.userId, data.date, data.part, JSON.stringify(data.items) ]
    let result = await connection.query(query, values)


    response = { ok: true }
  }catch(e){
    console.log(e);

    response = { error: e }
  }
  res.json(response)
})



module.exports = router

