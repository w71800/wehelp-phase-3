const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const secretKey = 'secret'
const mysql = require("mysql2")
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'project',
  connectionLimit: 10
})

const connection = pool.promise()
router.use(express.urlencoded({ extended: true }))
// router.use(express.json())

async function authHandler(req, res){
  let response = null
  
  // 處理登入
  if(req.method == "PUT"){
    let { id, username, email, password } = req.body
    let query = `SELECT * from users WHERE email = ? and password = ?`
    let values = [ email, password ]
    
    let [ rows ] = await connection.query(query, values)
    if(rows.length !== 0){
      let token = jwt.sign({ 
        userId: id, 
        username, 
        password, 
        email, 
        category: rows.category }, secretKey, { expiresIn: '1h' });
      response = JSON.stringify({ ok: true, token })
    }else{
      response = JSON.stringify({ msg: "無此使用者" })
    }
    try{
    }catch(e){
      response = JSON.stringify({ error: e })
    }
  }
  else if(req.method == "POST"){
    try{
      let { username, email, password, category } = req.body
      let query = `INSERT into users(username, email, password, category) 
      values(?, ?, ?, ?)`
      let values = [ username, email, password, category ]

      let result = await connection.query(query, values)
      response = JSON.stringify(result)
    }catch(e){
      response = e.errno == 1062? JSON.stringify({ msg: "已有此信箱" }) : JSON.stringify({ msg: e })
    }
  }
  else if(req.method == "GET"){
    try{
      let token = req.headers['authorization']
      jwt.verify(token, secretKey, (err, decode) => {
        if(err){
          response = { msg: err }
        }

        response = decode
      })
      // let query = `SELECT * from users WHERE email = ? and password = ?`
      // // let values = [ email, password ]
      // let values = [ "admin@admin", "0000" ]
      // let [ rows ] = await connection.query(query, values)

    }catch(e){

    }
  }
  
  res.send(response)
}



router.route("/").all(authHandler)

module.exports = router