var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var hyperwalletconf = require('../../config/hyperwalletconf');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('myaccount/index', { title: 'My account' });
});
router.get('/phoneverify', function(req, res, next) {
  var userid = req.session.user.id;
  User.findById(userid, function(err, doc) {
      if (err || !doc) {
          var errors={'result':false,'msg':'User not found for this ID.'};
          return  res.json(errors);
      }
      // If we find the user, let's validate the token they entered
      user = doc;
      res.render('auth/phoneverify', {title: 'phoneverify Page',usertoverify: user});
  });

});
router.get('/changepassword', function(req, res, next) {
  res.render('myaccount/changepassword', { title: 'My account setting'});
});
router.post('/changepassword', function(req, res, next) {
  var oldpassword = req.body.old_password;
  var password = req.body.password;
  var password2 = req.body.password2;
  var newUserlog = {
      id: req.session.user.id,
      oldpassword: oldpassword,
      password: password
  };
  // Form Validation
  req.checkBody('old_password', 'Old Password field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  // Check for errors
  var errors = req.validationErrors();

  if (errors) {
      console.log(errors);
      res.render('myaccount/changepassword', {
          errors: JSON.stringify(errors),
          password: password,
          password2: password2
      });
  } else {

      var newUser = {
          id: req.session.user.id,
          oldpassword: oldpassword,
          password: password
      };
      console.log(newUser+"_changepassword");
      // Create User
      User.changepassword(newUser, function (err, user) {
          if (err) {
            console.log(err+"_change password error");
            var errors=[{'msg':err}];
            res.render('myaccount/changepassword', {
                errors: JSON.stringify(errors),
                password: password,
                password2: password2
            });
          }else{
            console.log(err+"_change password success");
            res.render('myaccount/changepassword', {title: 'Signup Page',success: "Successfully updated!"});
          }
      });
  }
});
router.get('/setting', function(req, res, next) {
  User.findById(req.session.user.id, function(err, doc) {
      if (err || !doc) {
          var errors={'result':false,'msg':'User not found for this ID.'};
          return  res.json(errors);
      }
      console.log('user_exist_______________________');
      // If we find the user, let's validate the token they entered
      user = doc;

      res.render('myaccount/setting', { title: 'My account setting',usertoverify: user });
  });

});
router.post('/setting', function (req, res, next) {

    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var dateOfBirth = req.body.dateOfBirth;
    var addressLine1 = req.body.addressLine1;
    var city = req.body.city;
    var country = req.body.country;
    var stateProvince = req.body.stateProvince;
    var postalCode = req.body.postalCode;
    // Form Validation

    req.checkBody('firstName', 'First Name field is required').notEmpty();
    req.checkBody('lastName', 'Last Name field is required').notEmpty();
    req.checkBody('dateOfBirth', 'DateOfBirth field is required').notEmpty();
    req.checkBody('addressLine1', 'AddressLine1 field is required').notEmpty();
    req.checkBody('city', 'City field is required').notEmpty();
    req.checkBody('country', 'Country field is required').notEmpty();
    req.checkBody('stateProvince', 'StateProvince field is required').notEmpty();
    req.checkBody('postalCode', 'PostalCode field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();

    // Check for errors
    var errors = req.validationErrors();
    var newUser = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        addressLine1: addressLine1,
        city: city,
        country: country,
        stateProvince: stateProvince,
        postalCode: postalCode,
    };
    if (errors) {
        console.log(errors);
        res.render('myaccount/setting', {
            errors: JSON.stringify(errors),
            usertoverify:newUser
        });
    } else {
      User.findById(req.session.user.id, function(err, doc) {
          if (err || !doc) {
              var errors={'result':false,'msg':'User not found for this ID.'};
              return  res.json(errors);
          }
          console.log('user_exist___________setting____________');
          // If we find the user, let's validate the token they entered
          user = doc;
          newUser.clientUserId = user.clientUserId;
          // Create User
          console.log('updateing hyperwallet node --------------------------------------');
          var Hyperwallet = require('hyperwallet-sdk');
          var client = new Hyperwallet({ username: hyperwalletconf.username, password: hyperwalletconf.password,
          programToken: hyperwalletconf.programToken });
          console.log(dateOfBirth+"dateOfBirth");
          client.updateUser(user.hyperusertoken, newUser, function(error, body) {
            // handle response body here
             if (error) {
                console.log("update User Failed ---------------------hyperwallet -----------------------------");

                for (var i = 0;i<error.length;i++)
                error[i].msg = error[i].fieldName+" "+error[i].message;
                console.log(error);
                res.render('myaccount/setting', {
                    errors: JSON.stringify(error),
                    usertoverify:newUser
                });
             } else {
                console.log("update User sucess ---------------------hyperwallet -----------------------------");
                console.log(body);
                newUser.hyperusertoken=body.token,
                newUser.hyperuserstatus=body.status,
                newUser.hyperusercreatedon=body.createdOn
                console.log(newUser+"______newuser");
                User.updateUser(newUser, function (err, user) {
                    if (err) {
                      console.log(err+"==================== updated user to database error =========================");
                      var errors=[{'msg':err}];
                      res.render('myaccount/setting', {
                          errors: JSON.stringify(errors),
                          usertoverify:newUser
                      });
                    }else{
                      res.render('auth/phoneverify', {title: 'Signup Page',usertoverify: user});
                    }
                });
             }
          });
      });


    }
});
module.exports = router;
