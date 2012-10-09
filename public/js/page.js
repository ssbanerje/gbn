var socket = io.connect(window.location.origin);
var results = null;
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

var target = document.getElementById('spinner');
var spinner = new Spinner(opts);

$('#search-field').keypress(function (e) {
	if (e.which == 13) {
		var jsonQuery = null;
		try {
			jsonQuery = JSON.parse(this.value)
		} catch (err) {
			alert(err);
		}
		if(jsonQuery != null) {
			socket.emit('query', jsonQuery);
			spinner.spin(target);
		}
	}
});


$('#main-heading').click(clearResults);

$('#toggle-button').click(toggleResults);

$('#clear-results').click(clearResults);

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

socket.on('queryResponse', function (data){
	$('#query-nos').html('('+data.length+')');
	if(data.length == 0) {
		$('#footer').show()
		$('#result-list').slideUp()
		$('#result-list').html('');
	}
	clearSongDetails();
	var htmlString = '';
	results = data;
	for(var i in data) {
			htmlString = htmlString + '<li value="'+i+'" onclick="showResults(this.value)">'+data[i]['name']+'</li>';
	}
	$('#result-list').html(htmlString);
	$('#footer').show()
	$('#result-list').slideDown()
	spinner.stop()
});

function showResults(idx) {
	spinner.spin(target);
	$('#details').html('<ul><li><b>Name:</b> '+results[idx]['name']+'</li>'
						+'<li><b>Taal:</b> '+results[idx].taal+'</li>'
						+'<li><b>Raag:</b> '+results[idx].raag+'</li>'
						+'<li><b>Parjaay:</b> '+results[idx].parjaay+'</li></ul>');
	$.get(results[idx]['lyrics'], function(data) {
			$('#lyrics').html(data);
	});
	$('#notation').html('<img src="/'+results[idx].notation+'" width="100%" alt="Lyrics..."/>');
	$('#songs').html('<iframe width="100%" height="300px"'
						+' src="http://www.youtube.com/embed/?listType=search&list='+results[idx].name.replace(/ /g,'+')
						+'+tagore+bengali&showinfo=1" frameborder="0" allowfullscreen></iframe>');
	$('#song-details').show('fast');
	spinner.stop();
}

function toggleResults() {
  $('#result-list').slideToggle();
}

function clearResults() {
	$('#result-list').slideUp();
	$('#footer').hide();
	spinner.stop();
	clearSongDetails();
}

function clearSongDetails() {
	$('#song-details').hide('fast');
	$('#songs').html('');
}
