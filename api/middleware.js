const jwt = require("jsonwebtoken")
const secretKey = 'secret'

function authCheck(req, res, next){
  let token = req.headers['authorization']
  jwt.verify(token, secretKey, (err, decode) => {
    if(err){
      response = { msg: err }
    }
    response = decode
  })
}