var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('auth/login', { title: 'Login Page' });
});

module.exports = router;
