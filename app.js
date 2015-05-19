//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
var app = express();

dotenv.load();

var index = require('./routes/index');
var delphi = require('./util/delphi')(process.env.DELPHI_CONN_STRING);


//database setup
// var mongoose = require('mongoose');
// mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/projecttest');


//Configures the Template engine
app.engine('handlebars', handlebars());//{defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat',
	saveUninitialized: true,
	resave: true}));

//routes
app.get('/', index.view);


// TODO: Only for testing, the frontpage will probably be integrated into index later
app.get('/hslider', function(req, res) {
	res.render('index_hslider');
});

app.get('/labels', function(req, res) {
	res.render('index_labels');
});


//delphi routes
app.get("/soldforgainnorm", function (req, res) {
	delphi.getSoldForGainNorm("San Diego", function(rows){
		var jsonData = {};
		var currentRegion = rows[0]['RegionName'];
		var values = {};

		var i = 0;
		for(i = 0; i < rows.length; i++){
			var row = rows[i];
			if(row['RegionName'] != currentRegion){
				jsonData[currentRegion] = values;
				currentRegion = row['RegionName'];
				values = {};
			}
			values[row['Year']+"-"+row['Month']] = row['Value'];

		}

		return res.json(jsonData);
	});
});


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});