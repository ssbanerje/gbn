// Setup the busy spinner
var opts = {
	lines: 7, // The number of lines to draw
	length: 2, // The length of each line
	width: 4, // The line thickness
	radius: 3, // The radius of the inner circle
	corners: 1, // Corner roundness (0..1)
	rotate: 0, // The rotation offset
	color: '#000', // #rgb or #rrggbb
	speed: 1.7, // Rounds per second
	trail: 49, // Afterglow percentage
	shadow: false, // Whether to render a shadow
	hwaccel: true, // Whether to use hardware acceleration
	className: 'spinner', // The CSS class to assign to the spinner
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	top: 'auto', // Top position relative to parent in px
	left: 'auto' // Left position relative to parent in px
};
var spinner = new Spinner(opts).spin(document.getElementById('spinner'));

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
			spinner.spin();
		}
	};
	$scope.setSong = function(idx) { // Get the lyrics of the requested Songs
		spinner.spin();
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
	$scope.getYouTubeURL = function (string) {
		return 'http://www.youtube.com/embed/?listType=search&list='+string.replace(/ /g,'+')+'+tagore+bengali&showinfo=1';
	};
	
	// Handle Socket.io communications
	socket.on('queryResponse', function (data){
		$scope.results = data;
		//Page.hideSongDetails();
		$('#footer').show()
		$('#result-list').slideDown()
		//spinner.stop()
	});
	
	// Private Methods
};




// The object to control page behavior
var Page = {
	toggleResults: function () {
	  $('#result-list').slideToggle();
	},

	clearResults: function () {
		$('#result-list').slideUp();
		$('#footer').hide();
		spinner.stop();
		Page.hideSongDetails();
	},

	hideSongDetails: function () {
		$('#song-details').hide('fast');
	}
};

// Main() --- On load
$(function () {
	spinner.stop();
	// Clear result click listeners
	$('#main-heading').click(Page.clearResults);
	$('#clear-results').click(Page.clearResults);

	// Toggle results listener
	$('#toggle-button').click(Page.toggleResults);

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
