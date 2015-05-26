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
var helpers = require('./util/helpers');


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
app.get("/soldforgain", function (req, res) {
	delphi.executeYearBoundedCountyQuery({tablename: delphi.TABLE_SOLD_FOR_GAIN},
		{county: "San Diego", startYear: 2000, endYear: 2015},
		function(rows){
			return res.json(helpers.parseRowsByColumn(rows, 'RegionName', 'Value'));
	});
});

app.get("/mediansaleprice",function(req, res){
	delphi.executeYearBoundedCountyQuery({tablename: delphi.TABLE_MEDIAN_SALE_PRICE},
		{county: "San Diego", startYear: 2000, endYear: 2015},
		function(rows){
			return res.json(helpers.parseRowsByColumn(rows, 'RegionName', 'Value'));
	});
});

app.get("/soldasforeclosures", function(req, res){
	delphi.executeYearBoundedCountyQuery({tablename: delphi.TABLE_FORECLOSURES},
		{county: "San Diego", startYear: 2000, endYear: 2015},
		function(rows){
			return res.json(helpers.parseRowsByColumn(rows, 'RegionName', 'Value'));
	});
});

app.get("/soldforloss", function(req, res){
	delphi.executeYearBoundedCountyQuery({tablename: delphi.TABLE_SOLD_FOR_LOSS},
		{county: "San Diego", startYear: 2000, endYear: 2015},
		function(rows){
			return res.json(helpers.parseRowsByColumn(rows, 'RegionName', 'Value'));
	});
});


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});