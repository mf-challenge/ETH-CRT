var mongodb = require('mongoose');

var userSchema = require('../model/schema.js')


var url = "mongodb://localhost:27017/myDb";
var readUser = function( login,  password) {
  mongodb.connect(url)
  return new Promise(function(resolve, reject) {
    userSchema.find({
      'userName' : login,
      'password' : password
    },function(err, result) {
      if(err) return reject(0)
        if(result && result.length){
          console.log(JSON.stringify(result))
          resolve(1)
        }

        else {
          reject(0)
        }
    })
    })


}

var findUserName = function ( userName) {
  mongodb.connect(url)
  return new Promise (function(resolve, reject) {
    userSchema.find({
      'userName' : userName
    },function(err,result){
      if(err) return reject(0)
        if(result && result.length){
          console.log(JSON.stringify(result))
          reject(0)
        }
        else {
          resolve(1)
        }
    })

  })


}

var writeLogon = function( userName,  password,  address) {

mongodb.connect(url)
return new Promise(function(resolve, reject){
  var userObj = new userSchema({
    userName : userName,
    password : password,
    address : address
  });
  userObj.save()
  if(userObj)
    resolve(1)
  else
    reject(0)
})



}

module.exports.readUser = readUser;
module.exports.writeLogon = writeLogon;
module.exports.findUserName = findUserName;
