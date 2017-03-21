'use strict';
var express = require('express');
var router = express.Router();
var braintree = require('braintree');
var gateway = require('../../config/braintree/gateway');
var User = require('../../models/user');
var hyperwalletconf = require('../../config/hyperwalletconf');
var TRANSACTION_SUCCESS_STATUSES = [
  braintree.Transaction.Status.Authorizing,
  braintree.Transaction.Status.Authorized,
  braintree.Transaction.Status.Settled,
  braintree.Transaction.Status.Settling,
  braintree.Transaction.Status.SettlementConfirmed,
  braintree.Transaction.Status.SettlementPending,
  braintree.Transaction.Status.SubmittedForSettlement
];

function formatErrors(errors) {
  var formattedErrors = '';

  for (var i in errors) { // eslint-disable-line no-inner-declarations, vars-on-top
    if (errors.hasOwnProperty(i)) {
      formattedErrors += 'Error: ' + errors[i].code + ': ' + errors[i].message + '\n';
    }
  }
  return formattedErrors;
}

function createResultObject(transaction) {
  var result;
  var status = transaction.status;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Sweet Success!',
      icon: 'success',
      message: 'Your test transaction has been successfully processed. See the Braintree API response and try again.'
    };
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: 'Your test transaction has a status of ' + status + '. See the Braintree API response and try again.'
    };
  }

  return result;
}


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('moneytransfer/index', { title: 'Money Transfer' });
});
router.get('/moneytransfer', function(req, res, next) {
  User.findById(req.session.user.id, function(err, doc) {
      if (err || !doc) {
          var errors={'result':false,'msg':'User not found for this ID.'};
          return  res.json(errors);
      }
      // If we find the user, let's validate the token they entered
      var user = doc;
      gateway.clientToken.generate({}, function (err, response) {
        res.render('moneytransfer/moneytransfer', {clientToken: response.clientToken, messages: req.flash('error'),
                                                    hyperusertoken:user.hyperusertoken,
                                                    hyperprogramtoken:hyperwalletconf.programToken,
                                                    hyperun: hyperwalletconf.username, hyperpa: hyperwalletconf.password});
      });
  });

});
router.post('/post_moneytransfer', function (req, res) {//4111111111111111
  var transactionErrors;
  var amount = req.body.amount; // In production you should not take amounts directly from clients
  var nonce = req.body.payment_method_nonce;

  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    if (result.success || result.transaction) {
      res.json({"result": "1"});
    } else {
      transactionErrors = result.errors.deepErrors();
      res.json({"result": "-1",msg: formatErrors(transactionErrors)});
    }
  });
});
router.post('/post_hyper_pay', function (req, res) {//4111111111111111
  var hyperwallet_moneytransfer_response = req.body.hyperwallet_moneytransfer_response;
  var amount = req.body.amount;
  console.log(hyperwallet_moneytransfer_response);
  var Hyperwallet = require('hyperwallet-sdk');
  var client = new Hyperwallet({ username: hyperwalletconf.username, password: hyperwalletconf.password,
  programToken: hyperwalletconf.programToken });
  console.log(client+"-------------------------------------------hyperwallet client");
  client.createPayment({
    "clientPaymentId": Math.random().toString(36).substring(7),
    "amount": amount,
    "currency": hyperwallet_moneytransfer_response.transferMethodCurrency,
    "purpose": "OTHER",
    "destinationToken": hyperwallet_moneytransfer_response.token
  }, function(error, body) {
    // handle response body here
    console.log(error+"__________________createpayment error __________________");
    console.log(body+"__________________createpayment body__________________");
    if (error){
      return res.json({'result':'error',msg:error});
    }else{
      return res.json({'result':'success',msg:'successfully transfered'});
    }
  });
});
module.exports = router;
