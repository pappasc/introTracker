module.exports = function(){
    var express = require('express');
    const bodyParser = require('body-parser');
    var router = express.Router();
    var mysql = require('./../dbcon.js');

/*----------------START MS Helper Functions----------------*/
    
    function getAllMS(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `marketingSource`", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getAllActiveMS(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `marketingSource` where currentlyActive = true", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getAllInactiveMS(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `marketingSource` where currentlyActive = false", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getMS(mSId){
	var inserts = [mSId];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `marketingSource` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }
    
    function postMS(mSName, currAct){
	var inserts = [mSName, currAct];
	return new Promise (function (resolve, reject) {
	    mysql.query("INSERT INTO `marketingSource` (marketingName, currentlyActive, createdOn, lastUpdated) values (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function updateMS(mSId, marketingName, currActive) {
	var inserts = [marketingName, currActive, mSId];
	return new Promise (function (resolve, reject) {
	    mysql.query("UPDATE `marketingSource` set marketingName = ?, currentlyActive = ?, lastUpdated = CURRENT_TIMESTAMP where id = ?", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function deleteMS(mSId) {
	var inserts = [mSId];
	return new Promise (function (resolve, reject) {
	    mysql.query("DELETE FROM `marketingSource` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve ();
		}
	    });
	});
    }
    
/*----------------END MS Helper Functions----------------*/
    
/*----------------START MS Route Handlers----------------*/

    // Handler for getting all marketing sources
    router.get('/', function (req, res) {
	const accepted = req.get('Accept');
	getAllMS()
	    .then(mSs => {
		if (mSs.length == 0) {
		    res.status(404).send('No marketing sources found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(mSs);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting all marketing sources
    router.get('/active', function (req, res) {
	const accepted = req.get('Accept');
	getAllActiveMS()
	    .then(mSs => {
		if (mSs.length == 0) {
		    res.status(404).send('No marketing sources found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(mSs);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting all marketing sources
    router.get('/inactive', function (req, res) {
	const accepted = req.get('Accept');
	getAllInactiveMS()
	    .then(mSs => {
		if (mSs.length == 0) {
		    res.status(404).send('No marketing sources found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(mSs);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting ID specified marketing source
    router.get('/:ID', function (req, res) {
	const accepted = req.get('Accept');
	getMS(req.params.ID)
	    .then(mS => {
		if (mS.length == 0) {
		    res.status(404).send('No marketing source found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(mS);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for creating a marketing source entry
    router.post('/', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    postMS(req.body.marketingName, req.body.currentlyActive)
		.then((mS) => {
		    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + mS.insertId);
		    var sendNew = {id: mS.insertId};
		    res.status(201).send(sendNew);
		})
		.catch(error => {
		    res.status(500).send(error);
		});
	}
    });

    // Hanlder for patch without specifying marketing source
    router.patch('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for put without specifying marketing source
    router.put('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for delete without specifying marketing source
    router.delete('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for updating marketing source
    router.put('/:ID', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    getMS(req.params.ID).then((mS) => {
		if (mS.length == 0) {
		    res.status(404).send('Marketing Source with that ID not found');
		}
		else {
		    updateMS(req.params.ID, req.body.marketingName, req.body.currentlyActive)
			.then(() => {
			    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + req.params.ID);
			    var sendUpdated = {id: mS.insertId};
			    res.status(303).send(sendUpdated);
			})
			.catch(error => {
			    res.status(500).send(error);
			});
		}
	    });
	}
    });

    // Handler for deleting ID specified marketing source
    router.delete('/:ID', function (req, res) {
	deleteMS(req.params.ID)
	    .then(() => {
		res.status(204).send('No Content');
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

/*----------------END HRM Route Handlers---------------*/
    
    return router;
}();
