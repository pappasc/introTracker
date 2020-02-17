module.exports = function(){
    var express = require('express');
    const bodyParser = require('body-parser');
    var router = express.Router();
    var mysql = require('./../dbcon.js');

/*----------------START HRM Helper Functions----------------*/
    
    function getAllHRMs(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `hrms`", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getHRM(hrmId){
	var inserts = [hrmId];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `hrms` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }
    
    function postHRM(hrmName, price){
	var inserts = [hrmName, price];
	return new Promise (function (resolve, reject) {
	    mysql.query("INSERT INTO `hrms` (hrmName, price, createdOn, lastUpdated) values (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function updateHRM(hrmId, hrmName, price) {
	var inserts = [hrmName, price, hrmId];
	return new Promise (function (resolve, reject) {
	    mysql.query("UPDATE `hrms` set hrmName = ?, price = ?, lastUpdated = CURRENT_TIMESTAMP where id = ?", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function deleteHRM(hrmId) {
	var inserts = [hrmId];
	return new Promise (function (resolve, reject) {
	    mysql.query("DELETE FROM `hrms` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve ();
		}
	    });
	});
    }
    
/*----------------END HRM Helper Functions----------------*/
    
/*----------------START HRM Route Handlers----------------*/

    // Handler for getting all hrms
    router.get('/', function (req, res) {
	const accepted = req.get('Accept');
	getAllHRMs()
	    .then(hrms => {
		if (hrms.length == 0) {
		    res.status(404).send('No HRMs found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(hrms);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting ID specified hrm
    router.get('/:ID', function (req, res) {
	const accepted = req.get('Accept');
	getHRM(req.params.ID)
	    .then(hrm => {
		if (hrm.length == 0) {
		    res.status(404).send('No hrm found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(hrm);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for creating a hrm entry
    router.post('/', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accpets application/json data, you ding dong.');
	}
	else {
	    postHRM(req.body.hrmName, req.body.price)
		.then((hrm) => {
		    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + hrm.insertId);
		    var sendNew = {id: hrm.insertId};
		    res.status(201).send(sendNew);
		})
		.catch(error => {
		    res.status(500).send(error);
		});
	}
    });

    // Hanlder for patch without specifying hrm
    router.patch('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for put without specifying hrm
    router.put('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for delete without specifying hrm
    router.delete('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for updating hrm
    router.put('/:ID', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    getHRM(req.params.ID).then((hrm) => {
		if (hrm.length == 0) {
		    res.status(404).send('HRM with that ID not found');
		}
		else {
		    updateHRM(req.params.ID, req.body.hrmName, req.body.price)
			.then(() => {
			    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + req.params.ID);
			    var sendUpdated = {id: hrm.insertId};
			    res.status(303).send(sendUpdated);
			})
			.catch(error => {
			    res.status(500).send(error);
			});
		}
	    });
	}
    });

    // Handler for deleting ID specified hrm
    router.delete('/:ID', function (req, res) {
	deleteHRM(req.params.ID)
	    .then(() => {
		res.status(204).send('No Content');
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

/*----------------END HRM Route Handlers----------------*/
    
    return router;
}();
