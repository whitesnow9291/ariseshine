'use strict';

require('dotenv').load();

	// See your account sid & auth token: https://www.twilio.com/user/account/settings
	// See your phone number: https://www.twilio.com/user/account/phone-numbers/incoming
var twilioconf={
		'TWILIO_ACCOUNT_SID':'AC0bde6cbcccc699f78762638d2bec4319',
		'TWILIO_AUTH_TOKEN':'ffa96d6d42cff73ba7fb771fb9317744',
		'TWILIO_APP_SID':'AP12e72df8aa1434b5a1e54dac34050ccd',
		'TWILIO_NUMBER':'+13523645728'
	}

module.exports = twilioconf;
