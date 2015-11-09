var googleplaces = require('googleplaces');
var config = require('../config');
var querystring = require("querystring");
var places = googleplaces(config.googleMapsAPIKey, 'json');

"use strict";

exports.citiesAutoComplete = function(query, next){
  var parameters = {
    input: query,
    types: ['(regions)', '(cities)'],
    components:"country:US"
  };

  places.placeAutocomplete(parameters, function (error, response) {
    next(error, response);
  });
};


exports.locationAutoComplete = function(query, next){
  var parameters = {
    input: query,
    components:"country:US"
  };

  places.placeAutocomplete(parameters, function (error, response) {
    next(error, response);
  });
};
