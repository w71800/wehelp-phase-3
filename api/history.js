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
  let history = {
    item: null,
    last: {}
  }
  let { id: userId, part } = req.query
  try{
    let query = `
    SELECT id, items from lists where user_id = ? and part = ? 
    ORDER BY id ASC LIMIT 7
    `
    let values = [ userId, part ]
    let [ lists ] = await connection.query(query, values)

    let tempObj = {}
    lists.forEach( list => {
      list.items.forEach( item => {
        let itemName = item.item
        let last = item.sets[item.sets.length - 1]
        tempObj[itemName] = last
      })
    })

    let histories = Object.keys(tempObj).map( item => {
      return {
        item: item,
        last: tempObj[item]
      }
    })

    
    response = { data: histories }
  }catch(e){
    response = { error: e }
  }

  res.json(response)
})

module.exports = router

