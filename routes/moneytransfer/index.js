var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('moneytransfer/index', { title: 'Money Transfer' });
});

module.exports = router;
