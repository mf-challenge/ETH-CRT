/*This is copyrighted by Immergro Technologies PVT LTD@2018.
Licensed to Customers based on business agreement.
unauthorized copy  prohibited. Immergro attributes the copy right
of relevant sections incase of use of opensource software*/
const fs = require('fs');
var Web3 = require('web3');
const solc = require('solc');
var sleep = require('sleep')
var Personal = require('web3-eth-personal');
var config = require('../config.json')
var networkSend = require('../utils/sendtonetwork.js')
//networkSend.sendReqToNetwork(options)
var config = require('../config.json')
var helper = require('../utils/helper.js');
var logger = helper.getLogger('events');

         function DataToWorkday (event)
         {
           return {
             "docType":"transaction",
             "t_refnum":event.returnValues.trefno,
             "t_type":event.returnValues.transaction_type,
             "eth_hash":event.transactionHash,
             "from":event.returnValues.FrAccNo,
             "to":event.returnValues.ToAccNo,
             "f_address":event.returnValues._from,
             "remarks":event.returnValues.remarks,
             "num_tokens":Number(event.returnValues.tknval),
             "crt_address":event.address,
             "state":"AWARDED",
             "bnc":event.returnValues.buyernonce

           }


         }
var gasPrice, gas;
logger.info("Invoking Event Listener");
var web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546');
web3.eth.getProtocolVersion()
.then(console.log);

web3.eth.getAccounts(console.log);



function MFTokenEvtListener() {

  const input = fs.readFileSync('./solidity/MicroPats.sol');
  const cmpile_out = solc.compile(input.toString(),1);
  const bcode = cmpile_out.contracts[':MicroFocus'].bytecode;
  const abi = JSON.parse(cmpile_out.contracts[':MicroFocus'].interface);
  const Mycontract = new web3.eth.Contract(abi);



web3.eth.personal.unlockAccount(config.default_address, config.default_passwd)
    .then(() => {
      logger.info('Account unlocked.')

     }).then(() => {
       let Hello = new web3.eth.Contract(abi, null,
         {
            data: '0x' + bcode
         })
//set  the address of the contract instance we are interested in.
  Hello.options.address = config.mfptokencontract_address
  logger.info("Registering for MFToken contract Events")
  //Hello.events.BookRoomPostTfr({
  Hello.events.Transfer({
        //filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
       fromBlock: 0
    }, function(error, event){

      logger.info(event);
      logger.info("From MFToken contract handling")
    })
    .on('data', function(event){
        logger.info("From MFToken contract Data");
        logger.info("=========BEGIN==================================================================\n \n")
        logger.info(event);
        // same results as the optional callback above
        logger.info("XXXXXXXXXXXXXXXXXXX",event.returnValues.remaks)

        var options = {
                     uri: config.workday_endpoint,
                     method: 'PUT',
                     json: DataToWorkday(event)
                 };
        logger.info("network options are ", options)
        //DataToWorkday(event.returnValues.hname,event.returnValues._to,event.returnValues.cname,event.returnValues.rtype,event.returnValues.tknval)
        networkSend.sendReqToNetwork(options)
          logger.info("=======END====================================================================\n \n")
    })
    .on('changed', function(event){
      logger.info("From DailyLedger contract  handling Change");


        // remove event from local database
    })
    .on('error', console.error);
});
}

//Test function for metamask.




//exports.EventListener= EventListener

exports.MFTokenEvtListener = MFTokenEvtListener
