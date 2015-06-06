var models = require('../models');

var metros = [
		{metro: "San Diego", state: "CA"},
		{metro: "Los Angeles", state: "CA"},
		{metro: "San Francisco", state: "CA"}
	];

exports.view = function(req, res) {
	//search the database object for a model.
	res.render('index', {metros: metros});
};
