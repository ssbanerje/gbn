#!/usr/bin/env node

/*
 *
 * The main command line interface for the project
 * Run this as a server or as stand-alone application
 *
 */

var program = require('commander');
var fs = require('fs');
var child_process = require('child_process');
var database = require('./server/database.js');

function openFile(file) {
	var browser;
	switch(process.platform) {
		case "win32": browser = "start"; break;
		case "darwin": browser = "open"; break;
		default: browser = "xdg-open"; break;
	}
	child_process.spawn(browser, [file]);
}

// Set stuff for help
var packageJSON = JSON.parse(fs.readFileSync(__dirname+'/package.json', 'utf-8'));
program
	.version(packageJSON.version)
	.option('-l, --lyrics', 'Show lyrics when running query')
	.option('-n, --notation', 'Show notation when running query');

// Check the manifest
program
	.command('check-db')
	.description('Check to see if the database is working correctly')
	.action(function () {
    var path = require('path');
		var manifestFile = __dirname+'/raw-data/manifest.json';
		path.exists(manifestFile, function (exists) {
		if(exists) {
			console.log(JSON.parse(fs.readFileSync(manifestFile, 'utf-8')));
			console.log('Database has been and verified!');
		} else {
			throw new Exception('Database could not be verified!');
		}});
	});

// Perform query from command line
program
	.command('query <JSON_query>')
	.description('Query the system without starting a server. Each query must be in JSON format')
	.action(function (string) {
		var i, results = database.queryDB(string);
		console.log(JSON.stringify(results, null, '\t'));
		for(i in results) {
			if(program.lyrics) {
				console.log('Opening file ' +__dirname+'/'+results[i].lyrics);
				openFile(__dirname + '/'+ results[i].lyrics);
			}
			if(program.notation) {
				console.log('Opening file ' +__dirname+'/'+results[i].notation);
				openFile(__dirname + '/' + results[i].notation);
			}
		}
	});

// Start server
program
	.command('server')
	.description('Start server on 8080')
	.action(function () {
		var express = require('express');
		var http = require('http');
		var path = require('path');
		var app = express();

		app.configure(function () {
			app.set('port', process.env.app_port || 3000);
			app.set('views', __dirname + '/views');
			app.set('view engine', 'ejs');
			app.use(express.favicon());
			app.use(express.logger('dev'));
			app.use(express.bodyParser());
			app.use(express.methodOverride());
			app.use(express.cookieParser('onlinegitobitan@gbn'));
			app.use(express.session());
			app.use(app.router);
			app.use(express.static(path.join(__dirname, 'public')));
			app.use(function (req, res, next) {
				if (req.accepts('html')) {
					res.status(404).render('404', { url: req.url });
					return;
				}
				if (req.accepts('json')) {
					res.send(404, { error: 'Not found' });
					return;
				}
				res.type('txt').send(404, 'Not found');
			});
		});
		app.configure('development', function () {
			app.use(express.errorHandler());
		});
		var server = http.createServer(app).listen(app.get('port'), function () {
			console.log("Express HTTP server listening on port " + app.get('port'));
		});

		var io = require('socket.io').listen(server);
		io.set('log level', 2);
		setInterval(database.updateManifest, 600000);

		io.sockets.on('connection', function(socket){
			socket.on('query', function(data){
				var results = database.query(data);
				socket.emit('queryResponse', results);
			});
		});
		openFile('http://localhost:'+app.get('port'));
	});

// Lets get started
program.parse(process.argv);

