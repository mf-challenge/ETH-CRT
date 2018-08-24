/*This is copyrighted by Immergro Technologies PVT LTD@2018.
Licensed to Customers based on business agreement.
unauthorized copy  prohibited. Immergro attributes the copy right
of relevant sections incase of use of opensource software*/
'use strict';
var log4js = require('log4js');
//var logger = log4js.getLogger('Helper');
//logger.level='debug';

var getLogger = function(moduleName) {
var logger = log4js.getLogger(moduleName);
logger.level='debug';
//logger.setLevel('INFO')
	return logger;
};

exports.getLogger = getLogger;
