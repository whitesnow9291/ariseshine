var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');

/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('auth/login', { title: 'Login Page' });
});
router.get('/signup', function(req, res, next) {
    res.render('auth/signup', { title: 'Signup Page' });
});
// router.post('/signup', passport.authenticate('local-signup', {
//   successRedirect : '/profile', // redirect to the secure profile section
//   failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
//   failureFlash : true // allow flash messages
// }));
router.post('/signup', function(req, res, next) {
    res.render('auth/phoneverify', { title: 'Phone Veryfy' });
});
router.post('/phoneverify', function(req, res, next) {
    res.render('auth/verifysuccess', { title: 'Phone Verify Success' });
});
module.exports = router;
