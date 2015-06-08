//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
var async = require('async');
var app = express();

dotenv.load();

var delphi = require('./util/delphi')(process.env.DELPHI_CONN_STRING);
var helpers = require('./util/helpers');
var constants = require('./util/constants');


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

app.get('/', function(req, res){
	res.render('index', {metros: constants.METROS});
});

app.get('/hslider', function(req, res) {
	res.render('index_hslider');
});

app.get('/labels', function(req, res) {
	res.render('index_labels');
});


/*  delphi routes  */
app.post("/mediansaleprice",function(req, res){
	return queryDatabaseMetroAndZip({tablename: delphi.ZIP_TABLE_MEDIAN_SALE_PRICE, metro: false},
		{metro: req.body.metro, startYear: 2004, endYear: 2014},
		{tablename: delphi.METRO_TABLE_MEDIAN_SALE_PRICE, metro: true},
		{metro: req.body.metro + ", " + req.body.state, startYear: 2004, endYear: 2014},
		['RegionName', 'Value'],
		function(data){
			return res.json(data);
	});
});

app.post("/soldasforeclosures", function(req, res){
	return queryDatabaseMetroAndZip({tablename: delphi.ZIP_TABLE_FORECLOSURES, metro: false},
		{metro: req.body.metro, startYear: 2004, endYear: 2014},
		{tablename: delphi.METRO_TABLE_FORECLOSURES, metro: true},
		{metro: req.body.metro + ", " + req.body.state, startYear: 2004, endYear: 2014},
		['RegionName', 'Value'],
		function(data){
			return res.json(data);
		});
});

app.post("/soldforloss", function(req, res){
	delphi.executeYearBoundedQuery({tablename: delphi.ZIP_TABLE_SOLD_FOR_LOSS, metro: false},
		{metro: req.body.metro, startYear: 2004, endYear: 2014},
		function(rows){
			return res.json({values: helpers.reduceData(helpers.parseRowsByColumn(rows, 'RegionName', 'Value'),3), average: ""});
	});
});

app.post("/decreasinginvalues", function(req, res){
	return queryDatabaseMetroAndZip({tablename: delphi.ZIP_TABLE_DECREASING_VALUES, metro: false},
		{metro: req.body.metro, startYear: 2004, endYear: 2014},
		{tablename: delphi.METRO_TABLE_DECREASING_VALUES, metro: true},
		{metro: req.body.metro + ", " + req.body.state, startYear: 2004, endYear: 2014},
		['RegionName', 'Value'],
		function(data){
			return res.json(data);
		});
});

var queryDatabaseMetroAndZip = function(zip_config, zip_params, metro_config, metro_params, parsing_strings, callback){
	var async_tasks = [];
	var rows1;
	var rows2;
	async_tasks.push(function(callback){
		delphi.executeYearBoundedQuery(zip_config,
			zip_params,
			function(rows){
				rows1 = rows;
				callback();
			});
	});
	async_tasks.push(function(callback){
		delphi.executeYearBoundedQuery(metro_config,
			metro_params,
			function(rows){
				rows2 = rows;
				callback();
			});
	});
	async.parallel(async_tasks, function(err){
		if(err) return err;

		callback({values: helpers.reduceData(helpers.parseRowsByColumn(rows1, parsing_strings[0], parsing_strings[1]),3),
			average: helpers.reduceData(helpers.parseRowsByColumn(rows2, parsing_strings[0], parsing_strings[1]),3)});
	});
};


/* set environment ports and start application */
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});