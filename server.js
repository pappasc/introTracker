require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const path = require('path');
const uuid = require('uuid/v4');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var mysql = require('./dbcon.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Using handlebars for rendering pages
/*const handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');*/

//Set pathname for local file access
/*app.use(express.static(path.join(__dirname, '/public')));*/

app.use('/staff', require('./custom_modules/staff.js'));
app.use('/studio', require('./custom_modules/studio.js'));
app.use('/clients', require('./custom_modules/clients.js'));
app.use('/hrms', require('./custom_modules/hrms.js'));
app.use('/marketingSource', require('./custom_modules/marketingSource.js'));
app.use('/saleItem', require('./custom_modules/saleItem.js'));
//app.use('/appointments', require('./custom_modules/appointments.js'));

//If the user tries navigating to a non-supplied page
/*app.use(function(req,res){
  res.status(404);
  res.render('404');
});*/

//Something went wrong
/*app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});*/

app.get('/status', (req, res) => res.send('Working!'));

const PORT = process.env.PORT || 8080;

app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
