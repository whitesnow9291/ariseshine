var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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
    fullName: {
        type: String,
        index: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    countryCode: {

    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    deviceToken: {
        type: String
    },
    balance: {
        type: String
    },

    customerId: {
        type: String
    },
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

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.createUser = function(newUser,callback){
    bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err) throw err;

        // Set Hashed password
        newUser.password = hash;

        // Create User
        newUser.save(callback);
    });
};
