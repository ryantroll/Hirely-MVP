// skills.json was generated using csvtojson: 
// npm install -g csvtojson; 
// csvtojson --ignoreEmpty=true ./Skills-Truncated-For-occMeta.csv > Skills-Truncated-For-occMeta.json

// This script produces occMetas.json
// To import to mongo:  mongoimport --db hirely --drop --jsonArray occMetas.json

var fs = require('fs');

fs.readFile('Skills-Truncated-For-occMeta.json', 'utf8', function (err,data) {
	if (err) {
    return console.log(err);
  }

	var rows = JSON.parse(data);
	var occMetasObj = {};
	var imValue = null;
	rows.forEach(function(row) {
		if (!(row.occId in occMetasObj)) {
			occMetasObj[row.occId] = {
				_id: row.occId,
				skillMetrics: []
			};
		}

		// Assume that every skill has exactly one IM and LV row, and that IM is always directly before LV.
		// Based on this assumption, let's cache the last IM value, in order to save both the IM and LV
		// into the same skill metric object.
		if (row.rowType == "IM") {
			imValue = row.value;
			return;
		}
		
		var skillMetric = {
			sid: row.skillId,
			name: row.skillName,
			im: String(imValue),
			lv: String(row.value)
		}

		occMetasObj[row.occId].skillMetrics.push(skillMetric);

	})

	// convert occMetasObj to list
	occMetasList = [];
	Object.keys(occMetasObj).forEach(function(occId) {
		occMetasList.push(occMetasObj[occId]);
	})

	// Sort skill metrics by IM descending
	occMetasList.forEach(function(occMeta) {
		occMeta.skillMetrics.sort(function(a, b) {
			return b.im - a.im;
		})	
	})


	var occMetasJson = JSON.stringify(occMetasList);

	fs.writeFile("occMetas.json", occMetasJson, function(err) {
		if(err) {
        return console.log(err);
    }
    console.log("File write success!");
	});

});