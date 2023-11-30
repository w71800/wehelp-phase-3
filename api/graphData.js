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
  let itemsObj = { }
  for(let row of rows){
    row.items.forEach( item => {
      itemsObj[item.item] = {}
    })
  }
  
  // 如果該日期清單有該 item 的話，則加入此日期，並將數據推進去
  for(let row of rows){
    let { date } = row
    
    row.items.forEach( item => {
      for(let key of Object.keys(itemsObj)){
        if(key == item.item) itemsObj[key][date] = {
          times: [],
          load: [],
          rpe: [],
          unit: item.sets[0].unit
        }
      }
      for(set of item.sets){
        itemsObj[item.item][date].times.push(parseInt(set.times))
        itemsObj[item.item][date].load.push(parseInt(set.load))
        itemsObj[item.item][date].rpe.push(parseInt(set.rpe))
      }
    })
  }

  response.data = itemsObj  
  
  res.json(response)
})

module.exports = router

// {
//   item: "硬舉（槓）",
//   data: {
//     "2023 / 11 / 06": {
//       times: [12, 12, 12],
//       load: [20, 25, 30],
//       rpe: [6, 7, 8],
//     },
//     "2023 / 11 / 07": {
//       times: [12, 12, 12],
//       load: [22, 28, 36],
//       rpe: [7, 8, 10],
//     },
//     "2023 / 11 / 08": {
//       times: [12, 12, 12],
//       load: [23, 30, 34],
//       rpe: [2, 2, 8],
//     },
//     "2023 / 11 / 10": {
//       times: [12, 12, 12],
//       load: [20, 21, 22],
//       rpe: [2, 6, 8],
//     }
//   },
//   unit: "kg"
// }