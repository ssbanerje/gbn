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
	.action(function(){
    var path = require('path');
		var manifestFile = __dirname+'/raw-data/manifest.json';
		path.exists(manifestFile, function(exists) {
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
	.action(function(string) {
		var database = require('./server/database.js');
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
	.action(function() {
		var server = require('./server/server.js');
		server.createServer();
		openFile('http://localhost:8080');
	});

// Lets get started
program.parse(process.argv);

