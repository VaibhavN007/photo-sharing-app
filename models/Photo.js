var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/photo_app');

var photoSchema = new mongoose.Schema({
	name: String,
	path: String
});

module.exports = mongoose.model('Photo', photoSchema);