module.exports = function(){
    var express = require('express');
    const bodyParser = require('body-parser');
    var router = express.Router();
    var mysql = require('./../dbcon.js');

/*----------------START Studio Helper Functions----------------*/
    
    function getAllStudios(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `studio`", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getStudio(studioId){
	var inserts = [studioId];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `studio` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getStudioStaff(studioId) {
	var inserts = [studioId];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT s.id, firstName, lastName, jobRole, s.phoneNumber, emailAddress FROM `staff` s inner join `worksAt` w on s.id = w.employeeId inner join `studio` st on w.studioId = st.id where st.id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }
    
    function postStudio(sNum, sName, pNum){
	var inserts = [sNum, sName, pNum];
	return new Promise (function (resolve, reject) {
	    mysql.query("INSERT INTO `studio` (studioNum, studioName, phoneNumber, createdOn, lastUpdated) values (?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function updateStudio(studioId, sNum, sName, pNumber) {
	var inserts = [sNum, sName, pNumber, studioId];
	return new Promise (function (resolve, reject) {
	    mysql.query("UPDATE `studio` set studioNum = ?, studioName = ? , phoneNumber = ?, lastUpdated = CURRENT_TIMESTAMP where id = ?", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function deleteStudio(studioId) {
	var inserts = [studioId];
	return new Promise (function (resolve, reject) {
	    mysql.query("DELETE FROM `studio` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve ();
		}
	    });
	});
    }

    function removeStaffFromStudio(staffId, studioId){
	var inserts = [staffId, studioId];
	return new Promise (function (resolve, reject) {
	    mysql.query("DELETE FROM `worksAt` WHERE employeeId = ? AND studioId = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve ();
		}
	    });
	});

    }
    
/*----------------END Studio Helper Functions----------------*/
    
/*----------------START Studio Route Handlers----------------*/

    // Handler for getting all studios
    router.get('/', function (req, res) {
	const accepted = req.get('Accept');
	getAllStudios()
	    .then(studio => {
		if (studio.length == 0) {
		    res.status(404).send('No studios found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(studio);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting ID specified studio
    router.get('/:ID', function (req, res) {
	const accepted = req.get('Accept');
	getStudio(req.params.ID)
	    .then(studio => {
		if (studio.length == 0) {
		    res.status(404).send('No studio found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(studio);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting the staff of ID specified studio
    router.get('/:ID/staff', function (req, res) {
	const accepted = req.get('Accept');
	getStudio(req.params.ID)
	    .then(studio => {
		if (studio.length == 0) {
		    res.status(404).send('No studio found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    getStudioStaff(req.params.ID)
			.then(staff => {
			    if (staff.length == 0) {
				res.status(404).send('No staff found');
			    }
			    else {
				res.status(200).send(staff);
			    }
			})
			.catch(error => {
			    res.status(500).send(error);
			});
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for creating a studio entry
    router.post('/', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accpets application/json data, you ding dong.');
	}
	else {
	    postStudio(req.body.studioNum, req.body.studioName, req.body.phoneNumber)
		.then((studio) => {
		    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + studio.insertId);
		    var sendNew = {id: studio.insertId};
		    res.status(201).send(sendNew);
		})
		.catch(error => {
		    res.status(500).send(error);
		});
	}
    });

    // Hanlder for patch without specifying studio
    router.patch('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for put without specifying studio
    router.put('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for delete without specifying studio
    router.delete('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for updating studio
    router.put('/:ID', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    getStudio(req.params.ID).then((studio) => {
		if (studio.length == 0) {
		    res.status(404).send('Staff with that ID not found');
		}
		else {
		    updateStudio(req.params.ID, req.body.studioNum, req.body.studioName, req.body.phoneNumber)
			.then(() => {
			    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + req.params.ID);
			    var sendUpdated = {id: studio.insertId};
			    res.status(303).send(sendUpdated);
			})
			.catch(error => {
			    res.status(500).send(error);
			});
		}
	    });
	}
    });

    // Handler for deleting ID specified studio
    router.delete('/:ID', function (req, res) {
	deleteStudio(req.params.ID)
	    .then(() => {
		res.status(204).send('No Content');
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for removing a staff member from a studio
    router.delete('/:studioId/staff/:staffId', function (req, res) {
	removeStaffFromStudio(req.params.staffId, req.params.studioId)
	    .then(() => {
		res.status(204).send('No Content');
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

/*----------------END Studio Route Handlers---------------*/
    
    return router;
}();
