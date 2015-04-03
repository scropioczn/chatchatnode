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
	if (err){
	  res.send('no');
	} else { 
	  
	  var contact = db.get('contact');
	  contact.insert({id: aid, contacts: []}, function(errr, docc) {
	    if (errr) {
		res.send('no');
	    } else {
		res.send('yes');
	    }	 
	  });
	}
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

// get pending messages
router.get('/get_messages', function(req, res, next) {
    var db = req.db;
    var collection = db.get('message');
    var aid = req.query['id'];
    var acid = req.query['cid'];
    
    collection.find({from:acid, to:aid}, {}, function(err, docs) {
	res.json(docs);
	    // delete after retreival
	    collection.remove({from:acid, to:aid}, function (err) {});
    });

});

// send message
router.get('/send_message', function(req,res,next) {
    var db = req.db;
    var collection = db.get('message');
    var aid = req.query['id'];
    var acid = req.query['cid'];
    var acontent = req.query['content'];
    var atime = req.query['time'];

    collection.insert({from:aid, to:acid, content:acontent, time:atime}, function(err, doc) {if (err) {res.send('no');}else {res.send('yes');}  });

});

// add contact

router.get('/add_contact', function(req, res, next) {
    var db = req.db;
    var collection = db.get('contact');
    var aid = req.query['id'];
    var acid = req.query['cid'];

    collection.findAndModify(
    {id: aid}, 
    {$addToSet: {contacts: {cid:acid}}},
    function(err, doc) {
	if (err) {
	   res.send('no');
	} else {
	   // add contact on the other side
	   collection.findAndModify(
	    {id: acid},
	    {$addToSet: {contacts: {cid: aid}}},
	    function (errr, docc) {
		if (errr) {
		    res.send('no');
		} else {
		    res.send('yes');
		}
	    }
	   );
	}
    }
    );

});


module.exports = router;
