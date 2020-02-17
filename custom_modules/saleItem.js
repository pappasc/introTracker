module.exports = function(){
    var express = require('express');
    const bodyParser = require('body-parser');
    var router = express.Router();
    var mysql = require('./../dbcon.js');

/*----------------START SI Helper Functions----------------*/
    
    function getAllSI(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `saleItem`", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getAllActiveSI(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `saleItem` where available = true", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getAllInactiveSI(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `saleItem` where available = false", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getSI(sIId){
	var inserts = [sIId];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `saleItem` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }
    
    function postSI(memName, memPrice, memType, available){
	var inserts = [memName, memPrice, memType, available];
	return new Promise (function (resolve, reject) {
	    mysql.query("INSERT INTO `saleItem` (membershipName, membershipPrice, membershipType, available, createdOn, lastUpdated) values (?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function updateSI(mSId, memName, memPrice, memType, available) {
	var inserts = [memName, memPrice, memType, available, mSId];
	return new Promise (function (resolve, reject) {
	    mysql.query("UPDATE `saleItem` set membershipName = ?, membershipPrice = ?, membershipType = ?, available = ?, lastUpdated = CURRENT_TIMESTAMP where id = ?", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function deleteSI(sIId) {
	var inserts = [sIId];
	return new Promise (function (resolve, reject) {
	    mysql.query("DELETE FROM `saleItem` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve ();
		}
	    });
	});
    }
    
/*----------------END SI Helper Functions----------------*/
    
/*----------------START SI Route Handlers----------------*/

    // Handler for getting all sale items
    router.get('/', function (req, res) {
	const accepted = req.get('Accept');
	getAllSI()
	    .then(sIs => {
		if (sIs.length == 0) {
		    res.status(404).send('No sale items found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(sIs);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting all active sale items
    router.get('/active', function (req, res) {
	const accepted = req.get('Accept');
	getAllActiveSI()
	    .then(sIs => {
		if (sIs.length == 0) {
		    res.status(404).send('No sale items found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(sIs);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting all inactive sale items
    router.get('/inactive', function (req, res) {
	const accepted = req.get('Accept');
	getAllInactiveSI()
	    .then(sIs => {
		if (sIs.length == 0) {
		    res.status(404).send('No sale item found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(sIs);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting ID specified sale item
    router.get('/:ID', function (req, res) {
	const accepted = req.get('Accept');
	getSI(req.params.ID)
	    .then(sI => {
		if (sI.length == 0) {
		    res.status(404).send('No sale item found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(sI);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for creating a sale item entry
    router.post('/', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    postSI(req.body.membershipName, req.body.membershipPrice, req.body.membershipType, req.body.available)
		.then((sI) => {
		    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + sI.insertId);
		    var sendNew = {id: sI.insertId};
		    res.status(201).send(sendNew);
		})
		.catch(error => {
		    res.status(500).send(error);
		});
	}
    });

    // Hanlder for patch without specifying sale item
    router.patch('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for put without specifying sale item
    router.put('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for delete without specifying sale item
    router.delete('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for updating sale item
    router.put('/:ID', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    getSI(req.params.ID).then((sI) => {
		if (sI.length == 0) {
		    res.status(404).send('Sale item with that ID not found');
		}
		else {
		    updateSI(req.params.ID, req.body.membershipName, req.body.membershipPrice, req.body.membershipType, req.body.available)
			.then(() => {
			    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + req.params.ID);
			    var sendUpdated = {id: sI.insertId};
			    res.status(303).send(sendUpdated);
			})
			.catch(error => {
			    res.status(500).send(error);
			});
		}
	    });
	}
    });

    // Handler for deleting ID specified sale item
    router.delete('/:ID', function (req, res) {
	deleteSI(req.params.ID)
	    .then(() => {
		res.status(204).send('No Content');
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

/*----------------END SI Route Handlers----------------*/
    
    return router;
}();
