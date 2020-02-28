module.exports = function(){
    var express = require('express');
    const bodyParser = require('body-parser');
    var router = express.Router();
    var mysql = require('./../dbcon.js');

/*----------------START Staff Helper Functions----------------*/
    
    function getAllStaff(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT id, firstName, lastName, phoneNumber, emailAddress, permissions, createdOn, lastUpdated FROM `staff`", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getAllStaffWithPass(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `staff`", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getStaffMember(staffId){
	var inserts = [staffId];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT id, firstName, lastName, phoneNumber, emailAddress, permissions, createdOn, lastUpdated FROM `staff` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getStaffMemberWithPass(eAddr){
	var inserts = [eAddr];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `staff` WHERE emailAddress = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getStudiosWorked(staffId) {
	var inserts = [staffId];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT st.id, studioName, jobRole, st.phoneNumber FROM `staff` s inner join `worksAt` w on s.id = w.employeeId inner join `studio` st on w.studioId = st.id where s.id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }
    
    function postStaff(fName, lName, pNum, eAddr, pword, perm){
	var inserts = [fName, lName, pNum, eAddr, pword, perm];
	return new Promise (function (resolve, reject) {
	    mysql.query("INSERT INTO `staff` (firstName, lastName, phoneNumber, emailAddress, password, permissions, createdOn, lastUpdated) values (?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function updateStaffMember(staffId, fName, lName, pNumber, eAddr, pword, perm) {
	var inserts = [fName, lName, pNumber, eAddr, pword, perm, staffId];
	return new Promise (function (resolve, reject) {
	    mysql.query("UPDATE `staff` set firstName = ?, lastName = ?, phoneNumber = ?, emailAddress = ?, password = ?, permissions = ?, lastUpdated = CURRENT_TIMESTAMP where id = ?", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function assignStaffToStudio(studioId, staffId, jobRole) {
	var inserts = [studioId, staffId, jobRole];
	return new Promise (function (resolve, reject) {
	    mysql.query("INSERT INTO `worksAt` (studioId, employeeId, jobRole, createdOn, lastUpdated) values (?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function updateStaffRole(studioId, staffId, jobRole) {
	var inserts = [jobRole, studioId, staffId];
	return new Promise (function (resolve, reject) {
	    mysql.query("UPDATE `worksAt` set jobRole = ?, lastUpdated = CURRENT_TIMESTAMP WHERE studioId = ? and employeeId = ?", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function deleteStaffMember(staffId) {
	var inserts = [staffId];
	return new Promise (function (resolve, reject) {
	    mysql.query("DELETE FROM `staff` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve ();
		}
	    });
	});
    }
    
/*----------------END Staff Helper Functions----------------*/

/*----------------START EXTRA Helper Functions----------------*/    

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

/*----------------END EXTRA Helper Functions----------------*/      
    
/*----------------START Staff Route Handlers----------------*/

    // Handler for getting all staff
    router.get('/', function (req, res) {
	const accepted = req.get('Accept');
	getAllStaff()
	    .then(staff => {
		if (staff.length == 0) {
		    res.status(404).send('No staff found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(staff);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting all staff with their passwords
    router.get('/pass', function (req, res) {
	const accepted = req.get('Accept');
	getAllStaffWithPass()
	    .then(staff => {
		if (staff.length == 0) {
		    res.status(404).send('No staff found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(staff);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting info of ID specified staff member without password
    router.get('/:ID', function (req, res) {
	const accepted = req.get('Accept');
	getStaffMember(req.params.ID)
	    .then(staff => {
		if (staff.length == 0) {
		    res.status(404).send('No staff member found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(staff);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting info including password of ID specified staff member
    router.get('/:eAddr/pass', function (req, res) {
	const accepted = req.get('Accept');
	getStaffMemberWithPass(req.params.eAddr)
	    .then(staff => {
		if (staff.length == 0) {
		    res.status(404).send('No staff member found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(staff);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    // Handler for getting studios that staff member works at
    router.get('/:ID/studio', function (req, res) {
	const accepted = req.get('Accept');
	getStaffMember(req.params.ID)
	    .then(staff => {
		if (staff.length == 0) {
		    res.status(404).send('No staff member found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    getStudiosWorked(req.params.ID)
			.then(studios => {
			    if (studios.length == 0) {
				res.status(404).send('No studios found');
			    }
			    else {
				res.status(200).send(studios);
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

    // Handler for creating a staff entry
    router.post('/', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accpets application/json data, you ding dong.');
	}
	else {
	    postStaff(req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.emailAddress, req.body.password, req.body.permissions)
		.then((staff) => {
		    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + staff.insertId);
		    var sendNew = {id: staff.insertId};
		    res.status(201).send(sendNew);
		})
		.catch(error => {
		    res.status(500).send(error);
		});
	}
    });

    // Hanlder for patch without specifying staff
    router.patch('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Hanlder for put without specifying staff
    router.put('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for delete without specifying staff
    router.delete('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for updating staff member
    router.put('/:ID', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    getStaffMember(req.params.ID).then((staff) => {
		if (staff.length == 0) {
		    res.status(404).send('Staff with that ID not found');
		}
		else {
		    updateStaffMember(req.params.ID, req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.emailAddress, req.body.password, req.body.permissions)
			.then(() => {
			    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + req.params.ID);
			    var sendUpdated = {id: staff.insertId};
			    res.status(303).send(sendUpdated);
			})
			.catch(error => {
			    res.status(500).send(error);
			});
		}
	    });
	}
    });

    // Handler for assigning staff member to studio
    router.put('/:staffId/studio/:studioId', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    getStaffMember(req.params.staffId)
		.then((staff) => {
		    if (staff.length == 0) {
			res.status(404).send('Staff with that ID not found');
		    }
		    else {
			getStudio(req.params.studioId)
			    .then((studio) => {
				if (studio.length == 0) {
				    res.status(404).send('Studio with that ID not found');
				}
				else {
				    assignStaffToStudio(req.params.studioId, req.params.staffId, req.body.jobRole)
					.then(() => {
					    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + req.params.staffId);
					    var sendUpdated = {id: staff.insertId};
					    res.status(303).send(sendUpdated);
					})
					.catch(error => {
					    res.status(500).send(error);
					});
				}
			    })
			    .catch(error => {
				res.status(500).send(error);
			    });
		    }
		})
		.catch(error => {
		    res.status(500).send(error);
		});
	}
    });

    // Handler for updating a staff member's role at a studio
    router.patch('/:staffId/studio/:studioId', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    getStaffMember(req.params.staffId)
		.then((staff) => {
		    if (staff.length == 0) {
			res.status(404).send('Staff with that ID not found');
		    }
		    else {
			getStudio(req.params.studioId)
			    .then((studio) => {
				if (studio.length == 0) {
				    res.status(404).send('Studio with that ID not found');
				}
				else {
				    updateStaffRole(req.params.studioId, req.params.staffId, req.body.jobRole)
					.then(() => {
					    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + req.params.staffId);
					    var sendUpdated = {id: staff.insertId};
					    res.status(303).send(sendUpdated);
					})
					.catch(error => {
					    res.status(500).send(error);
					});
				}
			    })
			    .catch(error => {
				res.status(500).send(error);
			    });
		    }
		})
		.catch(error => {
		    res.status(500).send(error);
		});
	}
    });

    // Handler for deleting ID specified staff
    router.delete('/:ID', function (req, res) {
	deleteStaffMember(req.params.ID)
	    .then(() => {
		res.status(204).send('No Content');
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

/*----------------END Staff Route Handlers---------------*/
    
    return router;
}();
