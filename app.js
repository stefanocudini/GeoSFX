
var fs = require('fs'),	
	uglify = require('uglify-js');
	polylineext = require('polyline-ext'),
	express = require('express'),
	pkg = require('./package.json'),
	app = express();

const defOpts = {
	port: 8080,
	timeout: 5000,
	jsonpCallback: 'jsonpcallback',
	dataDir: './examples/data/',
	dataUrl: '/data/:file',
	decoderFile: './node_modules/geobuf/dist/geobuf.js'
};

var server = app.listen(defOpts.port, function() {
  console.log('Express server listening on port ' + server.address().port);
});

server.timeout = defOpts.timeout;

app.get('/', function (req, res) {
  res.send( pkg.name +' version: '+ pkg.version );
});

app.get(defOpts.dataUrl, function(req, res) {

	var buf, json,
		file = defOpts.dataDir + req.params.file;

	if ( !req.query.hasOwnProperty(defOpts.jsonpCallback) ||
		 !fs.existsSync(file) )
		res.status(404).send('File Not Found');

	json = fs.readFileSync(file, 'utf8');
	
	//json = geobuf.encode(json, new pbf());
	decoder = fs.readFileSync(defOpts.decoderFile, 'utf8');

	//decoder = uglify.minify(decoder).code;

	callback = req.query[ defOpts.jsonpCallback ];

	//console.log(decoder)

	json = '(function(){'+

//TODO REFACT!!!
		//'var geobuf = require("geobuf"); '+
		//'	 pbf = require("pbf"); '+
		//callback+'(geobuf.decode(new pbf("'+json+'")'
		//'));'+
		'var JSON = '+json+';'+
		'\r\n'+

		callback+'( JSON );'+

	'}());';

	console.log('requested file: '+ file);

	res.header("Content-Type","application/javascript");
	res.send( json );
});
