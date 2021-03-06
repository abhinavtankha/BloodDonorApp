// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var multer   = require('multer');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
mongoose.set('debug', true);
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ 
	secret: 'ilovescotchscotchyscotchscotch',
	saveUninitialized: true,
	resave: true
})); 
// session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

/*
app.use(multer({dest: './uploads/',
	rename: function(fieldname, filename){
		return filename + Date.now();
	},
	onFileUploadStart: function (file) {
  		console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
  		console.log(file.fieldname + ' uploaded to  ' + file.path);
}}));
*/

// routes ======================================================================
// user details
require('./app/userRoutes.js')(app, passport); 

//user location
require('./app/locationRoutes.js')(app, passport); 

require('./app/donationDetails.js')(app, passport);

// launch ======================================================================
app.listen(port);
console.log('It happening on port ' + port + '... ');
