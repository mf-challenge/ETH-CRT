/*This is copyrighted by Immergro Technologies PVT LTD@2018.
Licensed to Customers based on business agreement.
unauthorized copy  prohibited. Immergro attributes the copy right
of relevant sections incase of use of opensource software*/
'use strict'
var helper = require('../utils/helper.js');
var logger = helper.getLogger('serviceofferings');
//var contracthandler = require('./../contracthandlers/test1contract.js')

var ServiceOfferingcontracthandler = require('./../contracthandlers/serviceofferings.js')



var BookingService = {

  InitialTokenTransfer : function(args) {

    logger.info(args)
    //invoke web3 function inmplemented for contract
    //deploy from corresponding contract handler

    return ServiceOfferingcontracthandler.MFTokenInitialTransaction(args)
  },

  

    TokenContractDeployment : function(args) {

      logger.info(args)
      //invoke web3 function inmplemented for contract
      //deploy from corresponding contract handler

      return ServiceOfferingcontracthandler.MFTokenContractDeploy(args)
    },


  queryAddress : function()
   {
      logger.info('Entering query adress function')
      return ServiceOfferingcontracthandler.MFTokenGetaddress()
  },
  RegisterEvents : function()
   {
      logger.info('Entering Register events function')
      return ServiceOfferingcontracthandler.MFTokenEventRegister()
  },
  queryContractBalance : function()
  {
    return ServiceOfferingcontracthandler.AdminTokenBalance()
  },
  querywalletBalance : function(args)
  {
    return ServiceOfferingcontracthandler.walletTokenBalance(args)
  }



}

module.exports = BookingService
