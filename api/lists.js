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

async function getListsHandler(req, res){
  console.log(req.query);
  /**
   * 幾個參數：
   * 1. 時間期間：week（預設）、biweeks、month、固定時間範圍
   * 2. 部位
   * 3. 訊息是否有未回應的（在前端針對 data 的 undone 是否為真直接開關即可）
   * 4. 身份 id（如果是教練的話則是傳入別的，如他的某學生。或許這些訊息用一個物件包起來比較好，不同身份傳入不同物件）
   * 
   * 以 12 個為一份
   * 
   * 送出去的 json：
   * {
   *  data: [{ ... }, { ... }],
   *  nextPage: 1 or null
   * }
   */
  let { id: userId, period, part, page } = req.query
  page = parseInt(page)
  let query = `SELECT * from lists WHERE user_id = ? LIMIT 13 OFFSET ?`
  let values = [ userId, (page - 1)*12 ]
  
  if(part !== 'null'){ 
    query = `
    SELECT * from lists WHERE user_id = ? and part = ? LIMIT 13 OFFSET ?`
    values = [ userId, part, (page - 1)*12 ]
  }
  let [ rows ] = await connection.query(query, values)
  let data = rows.slice(0, 12)

  let response = {
    data,
    nextPage: rows.length < 13? null : page + 1
  }
  // console.log(response);
  return res.json(response)
}

router.get("/", getListsHandler)

module.exports = router