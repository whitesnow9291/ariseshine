
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');

/* GET home page. */
router.get('/login', function (req, res, next) {
    res.render('auth/login', {title: 'Login Page'});
});
router.get('/signup', function (req, res, next) {
    res.render('auth/signup', {title: 'Signup Page'});
});
// router.post('/signup', passport.authenticate('local-signup', {
//   successRedirect : '/profile', // redirect to the secure profile section
//   failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
//   failureFlash : true // allow flash messages
// }));
router.post('/signup', function (req, res, next) {
    var fullname = req.body.fullname;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Form Validation

    req.checkBody('fullname', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);

    // Check for errors
    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('auth/signup', {
            errors: JSON.stringify(errors),
            fullname: fullname,
            email: email,
            password: password,
            password2: password2
        });
    } else {

        var newUser = new User({
            fullname: fullname,
            email: email,
            password: password
        });
        // Create User
        User.createUser(newUser, function (err, user) {
            if (err) {
              var errors=[{'msg':err}];
              res.render('auth/signup', {
                  errors: JSON.stringify(errors),
                  fullname: fullname,
                  email: email,
                  password: password,
                  password2: password2
              });
            }else{
              console.log('----------------------createUser-------------------------');
              console.log(user);
              console.log('----------------------createUser end---------------------');
              res.render('auth/phoneverify', {title: 'Signup Page',user: user});
            }
        });
    }
});
router.get('/sendAuthyToken', function (req, res, next) {
  var id = req.query.userid;
  var phoneNumber = req.query.phoneNumber;
  var countryCode = req.query.countryCode;
  User.sendAuthyToken(id,phoneNumber,countryCode,function(err) {
      console.log('---------------------------------------');
      console.log(err);
      console.log('---------------------------------------');


      if (err) {
          var errors={'result':false,'msg':'There was a problem sending your token - sorry :('};
          return  res.json(errors);
      }else{
        var errors={'result':true,'msg':'We have just sent auth code to your phone successfully'};
        return  res.json(errors);
      }

      // Send to token verification page

  })
});
// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });
//
// passport.deserializeUser(function (id, done) {
//     User.getUserById(id, function (err, user) {
//         done(err, user);
//     });
// });
//
// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         User.getUserByUsername(username, function (err, user) {
//             if (err) throw err;
//             if (!user) {
//                 console.log('Unknown User');
//                 return done(null, false, {message: 'Unknown User'});
//             }
//
//             User.comparePassword(password, user.password, function (err, isMatch) {
//                 if (err) throw err;
//                 if (isMatch) {
//                     return done(null, user);
//                 } else {
//                     console.log('Invalid Password');
//                     return done(null, false, {message: 'Invalid Password'});
//                 }
//             });
//         });
//     }
// ));

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password'
}), function (req, res) {
    console.log('Authentication Successful');
    req.flash('success', 'You are logged in');
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/users/login');
});

// router.post('/signup', function (req, res, next) {
//     res.render('auth/phoneverify', {title: 'Phone Veryfy'});
// });
router.post('/phoneverify', function (req, res, next) {
    res.render('auth/verifysuccess', {title: 'Phone Verify Success'});
});

module.exports = router;
