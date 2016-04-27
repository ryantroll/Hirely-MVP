'use strict'
var config = require('../config');
var http = require('https');
var q = require('q');
var xml2json = require('xml2json');

var onetOccSearchService = {
    request: function (method, host, path, params) {
        var deferred = q.defer();

        var options = {
            'hostname': host,
            "path": path,
            "method": method,
            "headers": {
                "Authorization": 'Basic ' + config.onetSecretKey
            }
        };

        var request = http.request(options, function (response) {
            var responseData = String();

            response.on('data', function (chunk) {
                responseData += chunk
            });

            response.on('end', function () {
                var responseDataJson = xml2json.toJson(responseData)
                var responseDataObj = JSON.parse(responseDataJson)
                deferred.resolve(responseDataObj);
            });
        });

        request.end(params);

        return deferred.promise;
    },

    onetCall: function (service) {
        var host = "services.onetcenter.org";
        var url = '/ws/' + service;
        // Use the following line to specify a specific version.  Note that I have not confirmed this will work long term.
        // var url = '/v1.6/ws/' + service;
        var separator = service.indexOf('?') !== -1 ? '&' : '?';
        url += separator + 'client=app_hirely_us_compas';
        return this.request('GET', host, url);
    },

    keywordSearch: function (query, full) {
        return this.onetCall("online/search?keyword="+encodeURIComponent(query)).then(function (matchesRaw) {
            var matches = [];
            for (let matchRaw of matchesRaw.occupations.occupation) {
                var match = {
                    occId: matchRaw.code,
                    occTitle: matchRaw.title
                };
                if (full != undefined) {
                    match.fit = Number(matchRaw.relevance_score);
                    match.tags = matchRaw.tags;
                }
                matches.push(match)
            }
            return matches;
        });
    }
};


module.exports = onetOccSearchService;
