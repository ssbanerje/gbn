var express = require('express');
var fs = require('fs');
var database = require('./database.js')


// Main server function
exports.createServer = function() {
	var app = express.createServer();
	var io = require('socket.io').listen(app);
  io.set('log level', 2);
	app.use(express.static(__dirname+'/../client'));
  app.use(express.errorHandler());
	app.listen(8080);

  setInterval(database.updateManifest, 600000);

  io.sockets.on('connection', function(socket){
		socket.on('query', function(data){
			var results = database.query(data);
			socket.emit('queryResponse', results);
		})
	})
};
