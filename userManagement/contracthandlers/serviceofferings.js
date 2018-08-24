/*This is copyrighted by Immergro Technologies PVT LTD@2018.
Licensed to Customers based on business agreement.
unauthorized copy  prohibited. Immergro attributes the copy right
of relevant sections incase of use of opensource software*/
const fs = require('fs');
var Web3 = require('web3');
const solc = require('solc');
var sleep = require('sleep')
var Personal = require('web3-eth-personal');
var mongoose = require('mongoose');
//var Myeth_member =require('../models/models.js')
//const Contract = require('../models/contractmodel.js');
var config = require('../config.json')
var helper = require('../utils/helper.js');
var logger = helper.getLogger('serviceofferings');
var events = require('../events/eventlistener')


const args = process.argv;
var gasPrice, gas,resp;
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//erc 20 Token Contract
const input = fs.readFileSync('./solidity/MicroPats.sol');
const cmpile_out = solc.compile(input.toString(),1);
const bcode = cmpile_out.contracts[':MicroFocus'].bytecode;
const abi = JSON.parse(cmpile_out.contracts[':MicroFocus'].interface);
const Mycontract = new web3.eth.Contract(abi);






function MFTokenContractDeploy(args){

return web3.eth.personal.unlockAccount(config.default_address, config.default_passwd)
   .then(() => {
     logger.info("Accout unlocked for user")

})
.then(() => {
  let CntrctABI = new web3.eth.Contract(abi, null,
      {
         data: '0x' + bcode
      })
    web3.eth.getGasPrice()
   .then((averageGasPrice) => {
        logger.info("Average gas price: " + averageGasPrice)
        gasPrice = averageGasPrice;
   }).
   catch(console.error);
   CntrctABI.deploy().estimateGas().
       then((estimatedGas) => {
           logger.info("Estimated gas: " + estimatedGas);
            gas = estimatedGas;
         }).
       catch(console.error);
      return CntrctABI.deploy().send({
           from: config.default_address,
           gasPrice: gasPrice,
           gas: 1100000
           //gas:500000
       }, function(error, transactionHash){logger.info("transactionHash from MFTokenContract contract deployment is %s",transactionHash)})
.on('error', function(error){
  logger.error("error",error)
  return 500
})
.on('transactionHash', function(transactionHash){ logger.info("transactionHash from MFTokenContract contract deployment %s",transactionHash) })
.on('receipt', function(receipt){
   logger.info("receipt from MFTokenContract deploy is ",receipt.contractAddress)// contains the new contract address

   config.mfptokencontract_address = receipt.contractAddress
   logger.info("config.serviceofferingscontract_address",config.mfptokencontract_address)
   logger.info("config file is",config)
   fs.writeFile("config.json",JSON.stringify(config),function(err){

     if(err)
      throw err;
      logger.info("configuration update done for MFTokenContract.")

   });
})
.on('confirmation', function(confirmationNumber, receipt){ logger.info("confirmationNumber from MFTokenContract deployment %s",confirmationNumber)})
.then(function(newContractInstance){
    logger.info(newContractInstance.options.address) // instance with the new contract address
    return newContractInstance.options.address

     });

});

}


function MFTokenInitialTransaction(args) {
   return web3.eth.personal.unlockAccount(config.default_address, config.default_passwd)
     .then(() => {
       logger.info("Accout unlocked for user")

       let TokenCntrctABI = new web3.eth.Contract(abi, null,
           {
              data: '0x' + bcode
           })

          TokenCntrctABI.options.address = config.mfptokencontract_address
           //logger.info("setter address",resp.eth_privatekey.address)
   logger.info("triggering token transfer")
                  //cdata = CntrctABI.methods.setTransaction(args.txnrefno,args.service_name,config.default_address,args.wallet_ownername,args.service_type,args.value,args.transaction_type,args.AccNo).encodeABI();
                  return TokenCntrctABI.methods.transfer(args.walletAddress,args.value).send({from:config.default_address,gas: 1200000})
                  .then(function(receipt){
                       logger.info("Transaction invoked on MFTokenContract",receipt)
                  return receipt
                });

        });
}


function MFTokenGetaddress() {
  console.log(config.serviceofferingscontract_address)
  return web3.eth.personal.unlockAccount(config.default_address, config.default_passwd)
     .then(() => {
       logger.info("Accout unlocked for user")
  return  config.mfptokencontract_address;
  });
}
function MFTokenEventRegister() {

  return web3.eth.personal.unlockAccount(config.default_address, config.default_passwd)
     .then(() => {
       logger.info("Accout unlocked for user")
       return events.MFTokenEvtListener();
  });
}

function AdminTokenBalance()
 {
  logger.info("In Default account balance")
  return web3.eth.personal.unlockAccount(config.default_address, config.default_passwd)
     .then(() => {
      logger.info("Accout unlocked for user")
       let CntrctABI = new web3.eth.Contract(abi, null,
         {
            data: '0x' + bcode
         })

                CntrctABI.options.address = config.mfptokencontract_address
                logger.info("Contract address is", CntrctABI.options.address)
                return CntrctABI.methods.balanceOf(config.default_address).call()
                .then(function(receipt){
                    logger.info("receipt from balanceOf invokation ",receipt)
                 return receipt
                });

  });

}
function walletTokenBalance(args)
{
 logger.info("In Default account balance")
 return web3.eth.personal.unlockAccount(config.default_address, config.default_passwd)
    .then(() => {
     logger.info("Accout unlocked for user")
      let CntrctABI = new web3.eth.Contract(abi, null,
        {
           data: '0x' + bcode
        })

               CntrctABI.options.address = config.mfptokencontract_address
               logger.info("Contract address is", CntrctABI.options.address)
               return CntrctABI.methods.balanceOf(args.walletAddress).call()
               .then(function(receipt){
                   logger.info("receipt from balanceOf invokation ",receipt)
                return receipt
               });

 });

}

//return balance
//function balanceOf(address who) public view returns (uint256);


/*function DailyLedgerTransferOwnership(user) {
    return web3.eth.personal.unlockAccount(config.default_address, config.default_passwd)
    .then(() => {
        let CntrctABI = new web3.eth.Contract(htl_abi, null,
        {
            data: '0x' + htl_bcode
        })
        CntrctABI.options.address = config.serviceofferingscontract_address

        return CntrctABI.methods.transferOwnership(config.mfptokencontract_address).send({from:config.default_address,gas: 1000000})
       .then(function(receipt){
             logger.info("DailyLedger contract ownership change completed ",receipt)
              return receipt
             });
            })
}




//helper functions
function SpecificUserData(args) {

  return Myeth_member.findOne({name: args})
  .then(function(user){
  logger.info("Data from DB is",user)
    return user
    //logger.info(user)
  })
}
//retirve specific contract data from mongoDB
function ContractData(args) {

  return Mycrt_member.findOne({name: args})
  .then(function(cntrct){
  logger.info("Contract data from DB is",cntrct)
    return cntrct
    //logger.info(user)
  })
}
function DailyLedgerContractData(args) {

  return Mycrt_member.find()
  .then(function(cntrct){
  logger.info("Contract data from DB is",cntrct)
    return cntrct
    //logger.info(user)
  })
}

function SrvLedgerContractDeploy(args){
//get user account and password from mongodb based on the incoming username in rest call.
return web3.eth.personal.unlockAccount(config.default_address, config.default_passwd)
   .then(() => {
     logger.info("Accout unlocked for user")

})
.then(() => {
  let CntrctABI = new web3.eth.Contract(dtl_abi, null,
    {
       data: '0x' + dtl_bcode
    })
    web3.eth.getGasPrice()
   .then((averageGasPrice) => {
       logger.info("Average gas price: " + averageGasPrice);
        gasPrice = averageGasPrice;
   }).
   catch(console.error);
   CntrctABI.deploy().estimateGas().
       then((estimatedGas) => {
           logger.info("Estimated gas: " + estimatedGas);
            gas = estimatedGas;
       }).
       catch(console.error);
      return CntrctABI.deploy().send({
           from: config.default_address,
           gasPrice: gasPrice,
           gas: 1100000
           //gas:500000
       }, function(error, transactionHash){logger.info("transactionHash from service offering contract is %s",transactionHash)})
.on('error', function(error){
  logger.error("error",error)
  return 500
})
.on('transactionHash', function(transactionHash){ logger.info("transactionHash service offering contract  is %s",transactionHash) })
.on('receipt', function(receipt){
   logger.info("receipt from service offering contract is ",receipt.contractAddress)
   // contains the new contract address
   config.srvv = receipt.contractAddress
   logger.info("config.srvv",config.srvv)
   logger.info("config file is",config)
   fs.writeFile("config.json",JSON.stringify(config),function(err){

     if(err)
      throw err;
      logger.info("configuration update done for service offering contract.")

   });

})
.on('confirmation', function(confirmationNumber, receipt){ logger.info("confirmationNumber from Deploy %s",confirmationNumber)})
.then(function(newContractInstance){
    logger.info(newContractInstance.options.address) // instance with the new contract address
    config.srvv = newContractInstance.options.address
    return newContractInstance.options.address
});
});
}

function SrvLedgerSetTransaction(args) {
logger.info("Direct invocation")

  return web3.eth.personal.unlockAccount(config.default_address, config.default_passwd)
     .then(() => {
       logger.info("Accout unlocked for user")
       let CntrctABI = new web3.eth.Contract(dtl_abi, null,
         {
            data: '0x' + dtl_bcode
         })
       let TokenCntrctABI = new web3.eth.Contract(abi, null,
           {
              data: '0x' + bcode
           })
  TokenCntrctABI.options.address = config.mfptokencontract_address
  CntrctABI.options.address = config.srvv;
  //logger.info("setter address",resp.eth_privatekey.address)
  //setTransaction(string trefno, string transaction_type, address _from, string FrAccNo,string ToAccNo,string remarks, uint amount, string buyernonce)
  cdata = CntrctABI.methods.setTransaction(args.txnrefno,args.transaction_type,config.default_address,args.FrAccNo,args.ToAccNo,args.remarks,args.value,args.buyernonce).encodeABI();
  return TokenCntrctABI.methods.transfer(CntrctABI.options.address,args.value,cdata).send({from:config.default_address,gas: 1000000})
.then(function(receipt){
    logger.info("receipt transaction ( direct)",receipt)
    logger.info("invoked service on ",CntrctABI.options.address)
    return receipt
  });
});

}*/
exports.MFTokenContractDeploy = MFTokenContractDeploy;
exports.MFTokenInitialTransaction = MFTokenInitialTransaction;
exports.MFTokenGetaddress = MFTokenGetaddress;
exports.MFTokenEventRegister = MFTokenEventRegister;
exports.AdminTokenBalance = AdminTokenBalance;
exports.walletTokenBalance =walletTokenBalance
