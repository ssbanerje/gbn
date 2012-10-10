// Setup the busy spinner
var spinnerTarget = document.getElementById('spinner');
var spinner = new Spinner({
	lines: 10,
	length: 5,
	width: 2,
	radius: 2,
	corners: 1,
	rotate: 0,
	color: '#000',
	speed: 1.7,
	trail: 49,
	shadow: false,
	zIndex: 2e9
}).spin(spinnerTarget);

// The AngularJS module
angular.module('gbn', ['ui'])
       .factory('socket', function ($rootScope) {
	var socket = io.connect(window.location.origin);
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

// The Controller
var Songs = function($scope, socket) {
	// $scope Methods and Variables
	$scope.queryText = '{"name": "abc"}'; // Text of the Query

	$scope.song = {}; // The song which is being displayed

	$scope.idx = 0;

	$scope.results = []; // Results of running the Query

	$scope.makeQuery = function () { // Make the query on server with Socket.io
		var query = null;
		try {
			query = JSON.parse($scope.queryText)
		} catch (err) {
			alert(err);
		}
		if(query != null) {
			socket.emit('query', query);
			spinner.spin(spinnerTarget);
		}
	};

	$scope.setSong = function(idx) { // Set the song selected by user
		spinner.spin(spinnerTarget);
		var s = $scope.results[idx];
		$.ajax({
			url:s.lyrics,
			success: function(data) {
				s.lyrics = data;
			},
			async: false
		});
		$scope.song = s;
		$('#song-details').show('fast');
		spinner.stop();
	};

	$scope.getYouTubeURL = function (string) { // The youtube.com URL for the query we wan to execute
		if(string!=undefined)
			return 'http://www.youtube.com/embed/?listType=search&list='+string.replace(/ /g,'+')+'+tagore+bengali&showinfo=1';
		else
			return '';
	};

	$scope.clearResults = function () { // Clear all results
		$('#result-list').slideUp();
		$scope.results = [];
		$('#footer').hide();
		spinner.stop();
		hideSongDetails();
	}

	// Handle Socket.io communications
	socket.on('queryResponse', function (data){
		$scope.results = data;
		hideSongDetails();
		$('#footer').show()
		$('#result-list').slideDown()
		spinner.stop()
	});

	// Private Methods
	var hideSongDetails = function () { //Hide the Song-Details section
		$scope.song = {};
		$('#song-details').hide('fast');
	}
};




// Main() --- On load
$(function () {
	// Stop spinning
	spinner.stop();

	// Toggle results listener
	$('#toggle-button').click(function () {
		$('#result-list').slideToggle();
	});

	// Click handlers for documentation links
	$('#disclaimer').click(function () {
		$('#disclaimer-message').fadeIn(200);
	});
	$('#qquery').click(function () {
		$('#qualified-message').fadeIn(200);
	});
	$('.use-query').click(function () {
		$('#search-field').val(this.getAttribute('data'));
		$('.overlay').fadeOut(200);
	});
	$('.close').click(function () {
		$('.overlay').fadeOut(200);
	});

});
