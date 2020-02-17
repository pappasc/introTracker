module.exports = function(){
    var express = require('express');
    const bodyParser = require('body-parser');
    var router = express.Router();
    var mysql = require('./../dbcon.js');

/*----------------START Clients Helper Functions----------------*/
    
    function getAllClients(){
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `clients`", function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getClientById(clientId){
	var inserts = [clientId];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `clients` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getClientsByStudio(studioId){
	var inserts = [studioId];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `clients` WHERE studioId = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function getProspectsByStudio(studioId){
	var inserts = [studioId, "prospect"];
	return new Promise (function (resolve, reject) {
	    mysql.query("SELECT * FROM `clients` WHERE studioId = ? and clientType = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    //All below functions should get client by respective studio
    function getClientByPNum(studioId, pNum){

    }

    function getClientsByEmail(){}

    function getClientsByFName(){}

    function getClientsByLName(){}

    function getClientsByBothNames(){}

    function getClientsBySource(){}

    function getClientsByType(){}

    function getClientsByDateRange(){}
    
    function postClient(studioId, fName, lName, pNum, eAddr, clientType, prospectSource){
	var inserts = [studioId, fName, lName, pNum, eAddr, clientType, prospectSource];
	return new Promise (function (resolve, reject) {
	    mysql.query("INSERT INTO `clients` (studioId, firstName, lastName, phoneNumber, emailAddress, clientType, numVisits, prospectSource, createdOn, lastUpdated) values (?,?,?,?,?,?,0,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function updateClient(studioId, fName, lName, pNum, eAddr, clientType, prospectSource) {
	var inserts = [studioId, fName, lName, pNum, eAddr, clientType, prospectSource];
	return new Promise (function (resolve, reject) {
	    mysql.query("UPDATE `client` set studioId = ?, firstName = ?, lastName = ? , phoneNumber = ?, emailAddress = ?, clientType = ?, numVisits = 0, prospectSource = ?,  lastUpdated = CURRENT_TIMESTAMP where id = ?", inserts, function (error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve (results);
		}
	    });
	});
    }

    function deleteClient(clientId) {
	var inserts = [clientId];
	return new Promise (function (resolve, reject) {
	    mysql.query("DELETE FROM `clients` WHERE id = ?", inserts, function(error, results, fields) {
		if (error) {
		    reject (error);
		}
		else {
		    resolve ();
		}
	    });
	});
    }
    
/*----------------END Client Helper Functions----------------*/
    
/*----------------START Client Route Handlers----------------*/

    // Handler for getting all clients
    router.get('/', function (req, res) {
	const accepted = req.get('Accept');
	getAllClients()
	    .then(clients => {
		if (clients.length == 0) {
		    res.status(404).send('No clients found');
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

    // Handler for getting ID specified client
    router.get('/:ID', function (req, res) {
	const accepted = req.get('Accept');
	getClient(req.params.ID)
	    .then(client => {
		if (client.length == 0) {
		    res.status(404).send('No client found');
		}
		else if (accepted !== 'application/json') {
		    res.status(406).send('No form acceptable');
		}
		else if (accepted === 'application/json') {
		    res.status(200).send(client);
		}
		else {
		    res.status(500).send('Something went really wrong.');
		}
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

    //Endpoint to get clients by Studio
    router.get('/studio/:studioId', function (req, res) {

    });

    //All below routers should get client by respective studio

    //Endpoint to get client by phone number
    router.get('/studio/:studioId/phone/:pNum', function (req, res) {

    });

    //Endpoint to get client by email
    router.get('/studio/:studioId/email/:eAddr', function (req, res) {

    });

    //Endpoint to get clients by first name
    router.get('/studio/:studioId/firstName/:fName', function (req, res) {

    });

    //Endpoint to get clients by last name
    router.get('/studio/:studioId/lastName/:lName', function (req, res) {

    });

    //Endpoint to get clients by full name
    router.get('/studio/:studioId/Name/:fName/:lName', function (req, res) {

    });

    //Endpoint to get clients by marketing source
    router.get('/studio/:studioId/source/:pSource', function (req, res) {

    });

    //Endpoint to get clients by type (prospect, member, etc)
    router.get('/studio/:studioId/type/:cliType', function (req, res) {

    });

    //Endpoint to get clients created in date range
    router.get('/studio/:studioId/date/:start/:end', function (req, res) {

    });

    // Handler for creating a client entry
    router.post('/', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    postClient(req.body.studioId, req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.emailAddress, req.body.clientType, req.body.prospectSource)
		.then((client) => {
		    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + client.insertId);
		    var sendNew = {id: client.insertId};
		    res.status(201).send(sendNew);
		})
		.catch(error => {
		    res.status(500).send(error);
		});
	}
    });

    // Hanlder for patch without specifying client
    router.patch('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for put without specifying client
    router.put('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for delete without specifying client
    router.delete('/', function (req, res) {
	res.set('Accept', 'GET, POST');
	res.status(405).end();
    });

    // Handler for updating client
    router.put('/:ID', function (req, res) {
	if (req.get('content-type') !== 'application/json') {
	    res.status(415).send('Server only accepts application/json data, you ding dong.');
	}
	else {
	    getClient(req.params.ID).then((client) => {
		if (client.length == 0) {
		    res.status(404).send('Client with that ID not found');
		}
		else {
		    updateClient(req.body.studioId, req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.emailAddress, req.body.clientType, req.body.prospectSource)
			.then(() => {
			    res.location(req.protocol + "://" + req.get('host') + req.baseUrl + '/' + req.params.ID);
			    var sendUpdated = {id: client.insertId};
			    res.status(303).send(sendUpdated);
			})
			.catch(error => {
			    res.status(500).send(error);
			});
		}
	    });
	}
    });

    // Handler for deleting ID specified client
    router.delete('/:ID', function (req, res) {
	deleteClient(req.params.ID)
	    .then(() => {
		res.status(204).send('No Content');
	    })
	    .catch(error => {
		res.status(500).send(error);
	    });
    });

/*----------------END Client Route Handlers----------------*/
    
    return router;
}();
