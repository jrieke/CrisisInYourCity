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


app.get("/metro", function(res, req){
	return res.json([
		{metro: "San Diego", state: "CA"},
		{metro: "Los Angeles", state: "CA"},
		{metro: "San Francisco", state: "CA"}
	]);
});

//delphi routes
app.post("/soldforgain", function (req, res) {
	console.log(req);
	delphi.executeYearBoundedQuery({tablename: delphi.ZIP_TABLE_SOLD_FOR_GAIN},
		{metro: req.body.metro, startYear: 2004, endYear: 2014},
		function(rows){
			return res.json(helpers.reduceData(helpers.parseRowsByColumn(rows, 'RegionName', 'Value'),3));
	});
});

app.post("/mediansaleprice",function(req, res){
	delphi.executeYearBoundedQuery({tablename: delphi.ZIP_TABLE_MEDIAN_SALE_PRICE, metro: false},
		{metro: req.body.metro, startYear: 2004, endYear: 2014},
		function(rows1){
			delphi.executeYearBoundedQuery({tablename: delphi.METRO_TABLE_MEDIAN_SALE_PRICE, metro: true},
				{metro: req.body.metro + ", " + req.body.state, startYear: 2004, endYear: 2014},
				function(rows2){
					return res.json({values: helpers.reduceData(helpers.parseRowsByColumn(rows1, 'RegionName', 'Value'),3),
						average: helpers.parseRowsByColumn(rows2, 'RegionName', 'Value')});
				});
		});
});

app.post("/soldasforeclosures", function(req, res){
	delphi.executeYearBoundedQuery({tablename: delphi.ZIP_TABLE_FORECLOSURES, metro: false},
		{metro: req.body.metro, startYear: 2004, endYear: 2014},
		function(rows1){
			delphi.executeYearBoundedQuery({tablename: delphi.METRO_TABLE_FORECLOSURES, metro: true},
				{metro: req.body.metro + ", " + req.body.state, startYear: 2004, endYear: 2014},
				function(rows2){
					return res.json({values: helpers.reduceData(helpers.parseRowsByColumn(rows1, 'RegionName', 'Value'),3),
						average: helpers.parseRowsByColumn(rows2, 'RegionName', 'Value')});
				});
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
	delphi.executeYearBoundedQuery({tablename: delphi.ZIP_TABLE_DECREASING_VALUES, metro: false},
		{metro: req.body.metro, startYear: 2004, endYear: 2014},
		function(rows1){
			delphi.executeYearBoundedQuery({tablename: delphi.METRO_TABLE_DECREASING_VALUES, metro: true},
				{metro: req.body.metro + ", " + req.body.state, startYear: 2004, endYear: 2014},
				function(rows2){
					return res.json({values: helpers.reduceData(helpers.parseRowsByColumn(rows1, 'RegionName', 'Value'),3),
						average: helpers.parseRowsByColumn(rows2, 'RegionName', 'Value')});
				});
	});
});

//Return topojson based on parameter. For example /topojson?city=3 will return the file for Los Angeles
app.get("/topojson", function(req, res){
	var city = req.query.city.valueOf().toLowerCase().trim().replace(/\s/g,'');
	return res.json(helpers.getTopoJson(city));
});


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});