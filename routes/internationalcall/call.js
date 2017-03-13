var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var twilioconf = require('../../config/twilio/twilioconf');

// POST /calls/connect
router.post('/connect', twilio.webhook({validate: false}), function(req, res, next) {
  var phoneNumber = req.body.phoneNumber;
  var callerId = twilioconf.TWILIO_NUMBER;
  var twiml = new twilio.TwimlResponse();
  var statusCallbackUrl = 'http://' + req.headers.host + '/internationalcall/call/statusCallback/';
  var numberDialer = function(dial) {
      dial.number(phoneNumber,{
          statusCallbackEvent: 'initiated ringing answered completed',
          statusCallback: statusCallbackUrl,
          statusCallbackMethod: 'POST'
      });
  };

  var clientDialer = function(dial) {
      dial.client("support_agent");
  };
console.log(req.body);
  if (phoneNumber != null) {
    twiml.dial({callerId : callerId}, numberDialer);
  }else {
    twiml.dial({callerId : callerId}, clientDialer);
  }
console.log(twiml+"_____________________________");
  res.send(twiml.toString());
});
router.post('/statusCallback',function(req,res,next){
  var status = req.body.CallStatus;
  console.log('--------------------------------------');
  console.log(req.body);
});
module.exports = router;
