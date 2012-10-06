var fs = require('fs');

var manifest = null;

// GREP an array
// Inspired heavily from the jQuery.grep() function
function _grep (elems, callback, inv) {
	var ret = [], retVal, i;
	inv = !!inv;
	for(i=0, length=elems.length; i<length; i++) {
		retVal = !!callback(elems[i], i);
                if (inv !== retVal) {
			ret.push(elems[i]);
		}
	}
	return ret;
}

// Load the latest manifest file
function _getLatestManifest () {
  manifest = JSON.parse(fs.readFileSync(__dirname+'/raw-data/manifest.json', 'utf-8'));
}
exports.updateManifest = _getLatestManifest;

// Query the manifest file with a JSON object
function _query (query) {
  var results, queryBy;
        if (manifest === null) {
	_getLatestManifest();
  }
	results = manifest;
	for(queryBy in query) {
		results = _grep(results, function (a) {
                        if (a[queryBy] && a[queryBy].search(new RegExp(query[queryBy])) === 0) {
				return true;
			}
			return false;
		});
	}
	return results;
}
exports.query = _query;

// Query the manifest file with a JSON query string
exports.queryDB = function (queryString) {
	var query = JSON.parse(queryString);
	return _query(query);
};

