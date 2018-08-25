4/*This is copyrighted by Immergro Technologies PVT LTD@2018.
Licensed to Customers based on business agreement.
unauthorized copy  prohibited. Immergro attributes the copy right
of relevant sections incase of use of opensource software*/
var express = require('express');
var bookings = require('../services/serviceofferings')
var router = express.Router();
var helper = require('../utils/helper.js');
var config = require('../config.json')
var logger = helper.getLogger('ctrl_serviceofferings');

//token contract deployment
router.post('/', function(req, res, next) {

 logger.info("incoming args", req.body)
  bookings.TokenContractDeployment(req.body)
            .then(function(response){
              logger.info("resp is",response)
              res.status(200).send(response)
            },
            function (error){
              logger.error("error is", error)
        res.send(500)
    })

});

//Initial token transfer - peer appreciation
router.post('/freepats', function(req, res, next) {

 logger.info("incoming args", req.body)
  bookings.InitialTokenTransfer(req.body)
            .then(function(response){
              logger.info("resp is",response)
              res.status(200).send(response)
            },
            function (error){
              logger.error("error is", error)
        res.send(500)
    })

});


router.get('/address', function(req, res) {
  logger.info("Received query for daily ledger adress  -> " );
   bookings.queryAddress()
   .then(function(response){
       res.status(200).send(response)
   }, function(err){
       logger.error("error is", err)
       res.status(500).send(err)
   });

});
router.post('/events', function(req, res) {
  logger.info("Registering for dailyledger events  -> " );
   bookings.RegisterEvents()
   .then(function(response){
       res.status(200).send(response)
   }, function(err){
       logger.error("error is", err)
       res.status(500).send(err)
   });

});

router.get('/adminbalance', function(req, res) {
  //var name = req.params.user
    logger.info("Received query for contract balance  -> " );

    //validate req and call service
    bookings.queryContractBalance()
    .then(function(response){
        res.status(200).send(response)
    }, function(err){
        logger.error("error is", err)
        res.status(500).send(err)
    });
//  return accounts.queryUserData(req.body)
//  res.status(200).send(accounts.queryUserData(req.body))
});

router.get('/walletbalance/:walletid', function(req, res) {
 var wallet = req.params.walletid
    logger.info("Received query for contract balance  -> " );

    //validate req and call service
    bookings.querywalletBalance(wallet)
    .then(function(response){
        res.status(200).send(response)
    }, function(err){
        logger.error("error is", err)
        res.status(500).send(err)
    });
//  return accounts.queryUserData(req.body)
//  res.status(200).send(accounts.queryUserData(req.body))
});


module.exports = router;
