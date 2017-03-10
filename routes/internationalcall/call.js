var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var twilioconf = require('../../config/twilio/twilioconf');

// POST /calls/connect
router.post('/connect', twilio.webhook({validate: false}), function(req, res, next) {
  var phoneNumber = req.body.phoneNumber;
  var callerId = twilioconf.TWILIO_NUMBER;
  var twiml = new twilio.TwimlResponse();

  var numberDialer = function(dial) {
      dial.number(phoneNumber);
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

module.exports = router;
