/*This is copyrighted by Immergro Technologies PVT LTD@2018.
Licensed to Customers based on business agreement.
unauthorized copy  prohibited. Immergro attributes the copy right
of relevant sections incase of use of opensource software*/
var request = require('request');
var helper = require('../utils/helper.js');
var logger = helper.getLogger('sendtonetwork');


var  networkService = {  sendReqToNetwork : function(options) {
logger.info("Options for  sendReqToNetwork" , options)
       return  new Promise(function(resolve, reject) {
           request(options, function(error, response, body){
               if(error){
                   logger.error("Network Failure",error);

                   reject("FAILED")
               }
               if (response===undefined){
                   logger.error("Respose undefined"  );
                   return reject("FAILED")
               }
               if (response.statusCode < 200 || response.statusCode >= 300) {
                   logger.error("Network rejection" ,response.statusCode );
                   return reject("FAILED");
               }

               //In case of successful submission one need not do any thing.
               //Bank will give response later and state will be updated
               logger.info("Submitted txn to network & resolved",body);
               return resolve(body)

           });
       });
   }
 }
module.exports = networkService
