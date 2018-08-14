var express = require('express');
var mongodb = require('mongoose');

var userSchema = require('../model/schema.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

});

router.get('/signIn', function(req, res, next) {
  mongodb.connect(url)
  const auth = {login: 'yourlogin', password: 'yourpassword'} // change this

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')
  console.log("userName and pass " + login + " " + password)
  userSchema.find({
    'userName' : login,
    'password' : password
  },function(err, result) {
    if(err) return err
      if(result && result.length){
        console.log(JSON.stringify(result))
        res.send("Login Success")
      }

      else {
        res.send("Login Failed")
      }
  })

});
var url = "mongodb://localhost:27017/myDb";

router.post('/signUp', function(req, res, next) {
var obj = req.body;
mongodb.connect(url)
// var newUser = new mongodb.Schema({
//   userName : String,
//   password: String,
//   address: String
// });
//var usermodel = mongodb.model('user', newUser)
userSchema.find({
  'userName' : obj.userName
},function(err,result){
  if(err) return err
    if(result && result.length){
      console.log(JSON.stringify(result))
      res.send("User is present")
    }
    else {
      var userObj = new userSchema({
        userName : obj.userName,
        password : obj.password,
        address : obj.address
      });

      userObj.save()

      res.send("Success")
    }
})
});


module.exports = router;
