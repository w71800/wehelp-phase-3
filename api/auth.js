const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const secretKey = 'secret'
const multer = require('multer')
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
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

async function authHandler(req, res){
  let response = null
  
  // 處理登入
  if(req.method == "PUT"){
    let { email, password } = req.body
    let query = `SELECT * from users WHERE email = ? and password = ?`
    let values = [ email, password ]
    
    let [ rows ] = await connection.query(query, values)
    if(rows.length !== 0){
      let { password, ...rest } = rows[0]
      
      if(rest.category == "coach"){
        let query = `SELECT id, username from users WHERE coach_id = ?`
        let [ students ] = await connection.query(query, rest.id)

        rest.students = students
      }else if(rest.category == "user"){
        let query = `SELECT id, username from users WHERE id = ?`
        let [ coach ] = await connection.query(query, rest.coach_id)
        
        rest = { ...rest, coach: coach[0] } 
      }

      let token = jwt.sign(
        { 
          email, 
          ...rest 
        }, secretKey, { expiresIn: '30d' });
      
      response = JSON.stringify({ ok: true, token, msg: "登入成功" })
    }else{
      response = JSON.stringify({ msg: "無此使用者或密碼錯誤" })
    }
    try{
    }catch(e){
      response = JSON.stringify({ error: e })
    }
  }
  else if(req.method == "POST"){
    try{
      let { username, email, password, category } = req.body
      /**
       * 先將每個註冊者的 coach_id 登記為 2
       */
      let query = `INSERT into users(username, email, password, category, coach_id) 
      values(?, ?, ?, ?, ?)`
      let values = [ username, email, password, category, 2 ]

      let result = await connection.query(query, values)
      response = JSON.stringify({ ok: true })
    }catch(e){
      response = e.errno == 1062? JSON.stringify({ msg: "已有此信箱" }) : JSON.stringify({ msg: e })
    }
  }
  else if(req.method == "GET"){
    try{
      let token = req.headers['authorization']
      jwt.verify(token, secretKey, (err, decode) => {
        if(err){
          response = JSON.stringify({ msg: err })
        }
        response = JSON.stringify(decode)
      })
    }catch(e){
      response = JSON.stringify({ msg: e })
    }
  }
  res.send(response)
}

router.route("/").all(upload.single('file'), authHandler)

module.exports = router