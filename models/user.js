var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var auth = require('../config/auth');

// Create authenticated Authy and Twilio API clients
var authy = require('authy')(auth.AUTHY_API_KEY);

var db = mongoose.connection;

// User Schema
// {
//     "_id" : ObjectId("587d605444121dc25998f648"),
//     "fullName" : "test",
//     "email" : "test.test@test.com",
//     "phone" : "9736686868",
//     "countryCode" : "1",
//     "password" : "$2a$10$vyjVMQNM3wFypbc57A..s.tHiVtJ9I..vO3eyPv9rZGOrClJ6DiHa",
//     "deviceToken" : "<84067db9 eb5b2ce3 a2dc9b95 5fe27ce5 4b74144e 0c90652e 9c4f75a4 b2ed5aac>",
//     "balance" : "101",
//     "customerId" : "19019022",
//     "verified" : true,
//     "authyId" : "28867505"
// }
var UserSchema = mongoose.Schema({

    //hyperwallet params
    clientUserId: {
      type: String
    },
    hyperusertoken: {
      type: String
    },
    hyperuserstatus: {
      type: String
    },
    hyperusercreatedon: {

    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String
    },
    dateOfBirth: {
      type: String
    },
    country: {
      type: String
    },
    stateProvince: {
      type: String
    },
    addressLine1: {
      type: String
    },
    city: {
      type: String
    },
    postalCode: {
      type: String
    },

    //authenticate
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    // phoneverify
    phone: {
        type: String
    },
    countryCode: {

    },
    // internet call
    amount: {
        type: String
    },
    //authy phone verify
    verified: {
        type: String
    },
    authyId: {
        type: String
    }

});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(candidatePassowrd, hash, callback){
    bcrypt.compare(candidatePassowrd, hash, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUserEmail = function(email, callback){
    var query = {email: email};
    User.findOne(query, callback);
}

module.exports.createUser = function(newUser,callback){
    User.findOne({ 'email' :  newUser.email }, function(err, user) {
        // if there are any errors, return the error before anything else
        var errors = null;
        if (err){
          errors=err;
        }
        if (user){
          errors='same email already exist!';
        }
        if (!user){
          bcrypt.hash(newUser.password, 10, function(err, hash){
              if(err) throw err;

              // Set Hashed password
              newUser.password = hash;
              newUser.amount = 1;
              // Create User
              newUser.save(callback);
          });
          return;
        }
        callback(errors,null);
    });
};
module.exports.updateUser = function(newUser,callback){
  var conditions = { clientUserId: newUser.clientUserId }
  , update = newUser
  , options = { multi: false };
  User.update(conditions, update, options, callback);
};
module.exports.changepassword = function(newUser,callback){
  User.findOne({ '_id' :  newUser.id }, function(err, userbyid) {
    User.comparePassword(newUser.oldpassword, userbyid.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          bcrypt.hash(newUser.password, 10, function(err, hash){
              if(err) throw err;
              console.log(hash+"_________________________update user hash created");
              // Set Hashed password
              userbyid.password = hash;
              // Create User
              userbyid.save(callback);
          });
        } else {
          errors='incorrect password!';
          return callback(errors,null);
        }
    });
  });
};
// Send a verification token to this user
module.exports.sendAuthyToken = function(userid,phoneNumber,countryCode,cb) {
  User.findOne({ '_id' :  userid }, function(err, user) {
      // if there are any errors, return the error before anything else
      var errors = null;
      if (err){
        errors=err;
        return callback(errors,null);
      }
      authy.register_user(user.email, phoneNumber, countryCode,
          function(err, response) {
          if (err || !response.user) return cb.call(     user, err);
          user.authyId = response.user.id;
          user.phone = phoneNumber;
          user.countryCode = countryCode;
          user.save(function(err, doc) {
              if (err || !doc) return cb.call(this, err);
              user = doc;
              sendToken();
          });
      });
      // if (!user.authyId) {
      //     // Register this user if it's a new user
      //     console.log(phoneNumber);
      //
      // } else {
      //     // Otherwise send token to a known user
      //     user.phone = phoneNumber;
      //     user.countryCode = countryCode;
      //     user.save(function(err, doc) {
      //         if (err || !doc) return cb.call(this, err);
      //         user = doc;
      //         sendToken();
      //     });
      // }

      // With a valid Authy ID, send the 2FA token for this user
      function sendToken() {
          authy.request_sms(user.authyId, true, function(err, response) {
              cb.call(this, err);
          });
      }
  });


};
// Send a verification token to this user
module.exports.sendAuthyTokenCall = function(userid,phoneNumber,countryCode,cb) {
  User.findOne({ '_id' :  userid }, function(err, user) {
      // if there are any errors, return the error before anything else
      var errors = null;
      if (err){
        errors=err;
        return callback(errors,null);
      }
      authy.register_user(user.email, phoneNumber, countryCode,
          function(err, response) {
          if (err || !response.user) return cb.call(     user, err);
          user.authyId = response.user.id;
          user.phone = phoneNumber;
          user.countryCode = countryCode;
          user.save(function(err, doc) {
              if (err || !doc) return cb.call(this, err);
              user = doc;
              sendToken();
          });
      });
      // if (!user.authyId) {
      //     // Register this user if it's a new user
      //     console.log(phoneNumber);
      //
      // } else {
      //     // Otherwise send token to a known user
      //     user.phone = phoneNumber;
      //     user.countryCode = countryCode;
      //     user.save(function(err, doc) {
      //         if (err || !doc) return cb.call(this, err);
      //         user = doc;
      //         sendToken();
      //     });
      // }

      // With a valid Authy ID, send the 2FA token for this user
      function sendToken() {
          authy.request_call(user.authyId, true, function(err, response) {
              cb.call(this, err);
          });
      }
  });


};
