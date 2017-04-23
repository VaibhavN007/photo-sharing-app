var express = require('express');
var router = express.Router();
var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');

var multer = require('multer');
var upload = multer({ dest: '../public/photos/'});
var type = upload.single('img');	// attribute = img should be same as the name of form field

/* GET users listing. */
router.get('/', function(req, res, next) {
	
	Photo.find({}, function(err, photos) {
		
		if(err) return next(err);
		
		res.render('photos/index', {
			title: 'Photos',
			photos: photos
		});
		
	});

});

router.get('/upload', function(req, res) {
	res.render('photos/upload', {
		title: 'Photo Upload',
		error: false
	});
});

router.post('/upload', type, function(req, res) {

	if(req.file.mimetype.indexOf('image') == 0)
	{
		var givenName = req.body.img_name;

		var extension = req.file.mimetype;

		extension = extension.substr(extension.lastIndexOf('/')).slice(1);

		if(givenName)
			filename = givenName.concat('.', extension);
		else
			filename = req.file.originalname;

		var temp_path = req.file.path;

		var target_path = path.join( __dirname, '../public/photos', filename);

		console.log(req.file);

		var src = fs.createReadStream(temp_path);
		var dest = fs.createWriteStream(target_path);

		src.pipe(dest);

		src.on('end', function() {

			Photo.create({
				name: filename,
				path: target_path
			});

			res.redirect('/photos');

		});
		src.on('error', function(){
			res.send('Error uploading file');
		});
	}
	else
	{
		res.render('photos/upload', {
			title: 'Photo Upload',
			error: 'Only Photos can be uploaded'
		});
	}

});

router.get('/download/:image_name', function(req, res) {
	var img_name = req.params.image_name;
	res.download('public/photos/'+img_name);
});

module.exports = router;
