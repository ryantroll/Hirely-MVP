//Google Geocode Backend Service
//
//Develoopers - Hirely 2015


var config = require('../config');
var geocoderProvider = 'google';
var httpAdapter = 'https';

var extra = {
  apiKey: config.googleMapsAPIKey, // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};


var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);


exports.geocodeAddress = function(address, next){

  geocoder.geocode({address: address, country:'US'}, function(error, response) {
    console.log(error);
    next(error, response);
  });

}
