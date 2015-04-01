var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/account', function(req, res) {
    var db = req.db;
    var collection = db.get('account');
    collection.insert({
	id: 'asdfsadf',
	password: '123213'
    }, function (err, doc) {if (err) throw err}); 
    res.render('account', {}); 
});

module.exports = router;
