var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// create a new account, assuming no repetetion of id (checked already)
// accepts: id, password
router.get('/account', function(req, res, next) {
    var db = req.db;
    var collection = db.get('account');
    var aid = req.query['id'];
    var apassword = req.query['password'];
    
    collection.insert({id: aid, password: apassword}, function(err, doc) {
	if (err){ res.send('yes');} else {res.send('no');}
    });     
});

// check account id existence
router.get('/check_account', function(req, res, next) {
    var db = req.db;
    var collection = db.get('account');
    var aid = req.query['id'];
    
    collection.find({id: aid}, {}, function(err, docs) {
	if (docs.length > 0) {
	    res.send('no');
	} else {
	    res.send('yes');
	}
    });
});

// login
router.get('/login', function(req, res, next) {
    var db = req.db;
    var collection = db.get('account');
    var aid = req.query['id'];
    var apassword = req.query['password'];

    collection.find({id:aid, password:apassword}, {}, function(err, docs) {
	if (docs.length == 1) {
	    res.send('yes');
	} else {
	    res.send('no');
	}
    });
});

// get contact info
router.get('/get_contacts', function(req, res, next) {
    var db = req.db;
    var collection = db.get('contact');
    var aid = req.query['id'];

    collection.find({id: aid}, {}, function(err, docs) {
	res.json(docs);
    });
});

module.exports = router;
