//Traitify Backend Service
//
//Develoopers - Hirely 2015


var config = require('../config');
var http = require('http');
var querystring = require('querystring');
var traitify = require('traitify');


//POST request to get assessment ID
exports.getAssessmentId = function (next) {


  traitify.setHost(config.traitify.host);
  traitify.setVersion(config.traitify.version);
  traitify.setSecretKey(config.traitify.secretKey);

  var deckId = 'career-deck';
  traitify.createAssessment(deckId, function(assessment){
    if(assessment){
      next(null, assessment)
    } else {
      next({'error':'couldn\'t retreive assesment id'}, null);
    }
  });

};
