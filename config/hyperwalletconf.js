'use strict';

require('dotenv').load();

	// See your account sid & auth token: https://www.twilio.com/user/account/settings
	// See your phone number: https://www.twilio.com/user/account/phone-numbers/incoming
var hyperwalletconf={
		'profileType':'INDIVIDUAL',
		'username':'restapiuser@6613301610',
		'password':'satellite@RGB9291',
		'programToken':'prg-1819a1be-a49b-4e26-9673-7e56e99ba357'
	}
// var twilioconf={
// 		'TWILIO_ACCOUNT_SID':'ACa58aa6cb2ab4382a42edf7339530654d',
// 		'TWILIO_AUTH_TOKEN':'8606234233c36adec84c537100d57c28',
// 		'TWILIO_APP_SID':'APd7fd882fd6b0415d8040ed8df6b54f45',
// 		'TWILIO_NUMBER':'+14253203470'
// 	}
module.exports = hyperwalletconf;
