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

router.get("/", async (req, res) => {
  let response = { data: null }
  let { id: userId, period, part, studentId } = req.query
  console.log(req.query);
  
  let query = `
    SELECT date, items FROM lists WHERE user_id = ?
    ${part ? 'AND part = ?' : ''}
    ${period ? 'AND created_at >= CURRENT_TIMESTAMP - INTERVAL ? DAY' : ''} 
    LIMIT 7
  `
  
  let values = [ userId ]
  if(studentId){
    values = []
    values.push(studentId)
  }
  if(part) values.push(part)
  if(period) values.push(period)

  let [ rows ] = await connection.query(query, values)

  // 遍歷所有 item 做出項目的清單架構 { 項目: {時間: ...}, ... }
  let itemsObj = {}
  for(let row of rows){
    row.items.forEach( item => {
      itemsObj[item.item] = {}
    })
  }
  
  // 如果該日期清單有該 item 的話，則加入此日期，並將數據推進去
  for(let row of rows){
    let { date } = row
    date = date.split("/").slice(1).join("/")
    
    row.items.forEach( item => {
      for(let key of Object.keys(itemsObj)){
        if(key == item.item) itemsObj[key][date] = {
          times: [],
          load: [],
          rpe: [],
          unit: item.sets[0].unit
        }
      }

      let labels = [ "times", "load", "rpe" ]
      for(set of item.sets){
        labels.forEach( label => {
          itemsObj[item.item][date][label].push(parseInt(set[label]))
        })
      }
    })
  }

  response.data = itemsObj  
  
  res.json(response)
})

module.exports = router
