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

router.put("/", async(req, res) => {
  let data = req.body
  let response = null
  try {
    console.log(data);
    let query = `UPDATE lists SET messages = ?, unreads = ? WHERE id = ?`
    let values = [ 
      JSON.stringify(data.messages), 
      JSON.stringify(data.unreads),
      data.id
    ]
    let result = await connection.query(query, values)
    console.log(result.affectedRows);

    if(data.category == "coach"){
      /**
       * 教練端的行為
       */
    }
    
    
  //   /**
  //    * result 可用的 api
  //    * [
  //         {
  //             "fieldCount": 0,
  //             "affectedRows": 1,
  //             "insertId": 0,
  //             "info": "Rows matched: 1  Changed: 0  Warnings: 0",
  //             "serverStatus": 2,
  //             "warningStatus": 0,
  //             "changedRows": 0
  //         },
  //       ]
  //    */
    response = { ok: true }
  } catch(e) {
    response = { error: e }
  }
  
  res.json(response)
})

module.exports = router