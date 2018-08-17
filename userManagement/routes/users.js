var express = require('express');
var mongodb = require('mongoose');
var dbCrud = require('../service/crud');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

});

router.get('/signIn', function(req, res, next) {

  const auth = {login: 'yourlogin', password: 'yourpassword'} // change this

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')
  console.log("userName and pass " + login + " " + password)

  dbCrud.readUser(login, password)
      .then(function(result) {
        console.log("Success");
        res.status(200).json({code:200,status:'success',message:'User SignedIn Successfully'})
      }, function(err) {
        console.log("faild");
        res.status(401).json({code:401,status:'failed',message:"Unauthorized"})
      });
});


router.post('/signUp', function(req, res, next) {
var obj = req.body;

dbCrud.findUserName(obj.userName).then(function(result){
    console.log("User not found")
    dbCrud.writeLogon(obj.userName,obj.password,obj.address).then(function(result){
      res.status(200).json({code:200,status:'success',message:'User SignedUp Successfully'})
    }, function(err){
      res.status(400).json({code:400,status:'failed',message:JSON.stringify(err)})
    })

},function(err){
  console.log("User present")
  res.status(400).json({code:400,status:'failed',message:'User is Already Present, Please SignIn'})
});
});


module.exports = router;
