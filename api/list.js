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
  let { id } = req.query
  try{
    let query = `SELECT * from lists WHERE id = ?`
    let [ row ] = await connection.query(query, id)
    
    response = { data: row[0] }
  }catch(e){
    response = { error: e }
  }
  res.json(response)
})

router.post("/", async(req, res) => {
  let data = req.body
  
  let response = null
  try {
    let query = `
      INSERT INTO lists(user_id, date, part, items, messages, unreads) values(?, ?, ?, ?, ?, ?)
      `
    let values = [
      data.userId, 
      data.date, 
      data.part, 
      JSON.stringify(data.items),
      JSON.stringify(data.messages),
      JSON.stringify(data.unreads),
    ]
    let result = await connection.query(query, values)


    response = { ok: true }
  } catch(e) {
    console.log(e);

    response = { error: e }
  }
  res.json(response)
})

// 整份送過來，然後更動 list 中的 items
router.put("/", async(req, res) => {
  let data = req.body
  let response = null
  
  
  try {
    let query = `UPDATE lists SET items = ?, messages = ?, unreads = ? WHERE id = ?`
    let values = [ 
      JSON.stringify(data.items), 
      JSON.stringify(data.messages), 
      JSON.stringify(data.unreads), 
      data.id 
    ]
    let result = await connection.query(query, values)

    if(data.category == "coach"){
      /**
       * 教練端的行為
       */
    }
    
    
    /**
     * result 可用的 api
     * [
          {
              "fieldCount": 0,
              "affectedRows": 1,
              "insertId": 0,
              "info": "Rows matched: 1  Changed: 0  Warnings: 0",
              "serverStatus": 2,
              "warningStatus": 0,
              "changedRows": 0
          },
        ]
     */
    // res.json(result)
    response = { ok: true }
  } catch(e) {
    response = { error: e }
  }
  
  res.json(response)
})



module.exports = router

