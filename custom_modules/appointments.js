module.exports = function(){
    var express = require('express');
    const bodyParser = require('body-parser');
    var router = express.Router();
    var mysql = require('./../dbcon.js');

/*----------------START Appointments Helper Functions----------------*/
    
    function getAllAppts(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `appointments`", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getAppt(apptId){
	var inserts = [apptId];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `appointments` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }
    
    function postAppt(studioId, clientId, schedulerId, apptDate, fcId, coachId, showed){
	var inserts = [studioId, clientId, schedulerId, apptDate, fcId, coachId, showed];
	return new Promise (function (resolve, reject) {
	    mysql.query("INSERT INTO `appointments` (studioId, clientId, schedulerId, apptDate, apptTime, fcId, coachId, showed, createdOn, lastUpdated) values (?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function updateAppt(studioId, clientId, schedulerId, apptDate, fcId, coachId, showed, apptId) {
	var inserts = [studioId, clientId, schedulerId, apptDate, fcId, coachId, showed, apptId];
	return new Promise (function (resolve, reject) {
	    mysql.query("UPDATE `appointments` set studioId = ?, clientId = ?, schedulerId = ?, apptDate = ?, fcId = ?, coachId = ?, showed = ?, lastUpdated = CURRENT_TIMESTAMP where id = ?", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function deleteAppt(apptId) {
	var inserts = [apptId];
	return new Promise (function (resolve, reject) {
	    mysql.query("DELETE FROM `appointments` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve ();
		}
	    });
	});
    }
    
/*----------------END Appointment Helper Functions----------------*/
    
/*----------------START Appointment Route Handlers----------------*/
    
    // Handler for getting all appointments
    router.get('/', function (req, res) {
	const accepted = req.get('Accept');
	getAllAppts()
	    .then(appts => {
		if (appts.length == 0) {
		    res.status(404).send('No appointments found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(appts);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting ID specified appointment
    router.get('/:ID', function (req, res) {
	const accepted = req.get('Accept');
	getAppt(req.params.ID)
	    .then(appt => {
		if (appt.length == 0) {
		    res.status(404).send('No appointment found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(appt);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for creating an appointment entry
    router.post('/', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    postAppt(/**/)
		.then((appt) => {
		    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + appt.insertId);
		    var sendNew = {id: appt.insertId};
		    res.status(201).send(sendNew);
		})
		.catch(error => {
		    res.status(500).send(error);
		});
	}
    });

    // Hanlder for patch without specifying appointment
    router.patch('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for put without specifying appointment
    router.put('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for delete without specifying appointment
    router.delete('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for updating appointment
    router.put('/:ID', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    getAppt(req.params.ID).then((appt) => {
		if (appt.length == 0) {
		    res.status(404).send('Appointment with that ID not found');
		}
		else {
		    updateAppt(/**/)
			.then(() => {
			    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + req.params.ID);
			    var sendUpdated = {id: appt.insertId};
			    res.status(303).send(sendUpdated);
			})
			.catch(error => {
			    res.status(500).send(error);
			});
		}
	    });
	}
    });

    // Handler for deleting ID specified appointment
    router.delete('/:ID', function (req, res) {
	deleteAppt(req.params.ID)
	    .then(() => {
		res.status(204).send('No Content');
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

/*----------------END Appointment Route Handlers---------------*/
    
    return router;
}();
