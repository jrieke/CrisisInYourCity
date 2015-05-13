var models = require('../models');

exports.view = function(req, res) {
	//search the database object for a model.
	res.render('index');
};
