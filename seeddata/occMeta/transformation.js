// skills.json was generated using csvtojson: 
// npm install -g csvtojson; 
// csvtojson --ignoreEmpty=true ./Skills-Truncated-For-occMeta.csv > Skills-Truncated-For-occMeta.json

// This script produces occMetas.json
// To import to mongo:  mongoimport --db hirely --drop --jsonArray occMetas.json

var fs = require('fs');

fs.readFile('Skills-Truncated-For-occMeta.json', 'utf8', function (err,skillData) {
    if (err) {
        return console.log(err);
    }

    fs.readFile('brian-career-matches.json', 'utf8', function (err,careerMatchData) {
        if (err) {
            return console.log(err);
        }

        var occMetasObj = {};

        /********************************************************

            PROCESS SKILLS DATA

        *********************************************************/

        var rows = JSON.parse(skillData);
        var imValue = null;
        rows.forEach(function(row) {
            if (!(row.occId in occMetasObj)) {
                occMetasObj[row.occId] = {
                    occID: row.occId,
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

        });

        // Sort skill metrics by IM descending
        Object.keys(occMetasObj).forEach(function(occId) {
            occMetasObj[occId].skillMetrics.sort(function(a, b) {
                return b.im - a.im;
            })  
        })

        

        /********************************************************

            PROCESS SKILLS DATA

        *********************************************************/

        var rows = JSON.parse(careerMatchData);
        rows.forEach(function(row) {
            row = row.career;

            var traitMetrics = [];

            row.personality_traits.forEach(function(traitRaw) {
                var traitMetric = {
                    name: traitRaw.personality_trait.name,
                    description: traitRaw.personality_trait.definition || traitRaw.personality_trait.description,
                    weight: traitRaw.weight
                }
                traitMetrics.push(traitMetric);
            });

            traitMetrics.sort(function(a, b) {
                return b.weight - a.weight;
            })  
            
            occMetasObj[row.id].traitMetrics = traitMetrics;

        });


        /********************************************************

            CONVERT TO LIST AND DUMP TO FILE

        *********************************************************/


        // convert occMetasObj to list
        occMetasList = [];
        Object.keys(occMetasObj).forEach(function(occId) {
            occMetasList.push(occMetasObj[occId]);
        })

        var occMetasJson = JSON.stringify(occMetasList);

        fs.writeFile("occMetas.json", occMetasJson, function(err) {
            if(err) {
                    return console.log(err);
            }
            console.log("File write success!");
        });

    });

});
