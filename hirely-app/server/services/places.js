"use strict";

var googleplaces = require('googleplaces');
var config = require('../config');
var querystring = require("querystring");
var places = googleplaces(config.googleMapsAPIKey, 'json');


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

exports.fullAddressAutocomplete = function(query, next){
  var parameters = {
    input: query,
    types: ['geocode'],
    components:"country:US"
  };

  places.placeAutocomplete(parameters, function (error, response) {
    next(error, response);
  });
};

exports.placeAutocomplete = function(query, next){
  var parameters = {
    input: query,
    types: [],
    components:"country:US"
  };

  places.placeAutocomplete(parameters, function (error, response) {
    next(error, response);
  });
};



exports.getPlaceDetailsByPlaceId = function(query, next){
  var parameters = {
    placeid: query
  };

  places.placeDetailsRequest(parameters, function (error, response) {
    next(error, response);
  });
};

