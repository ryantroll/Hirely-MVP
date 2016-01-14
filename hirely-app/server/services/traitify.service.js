//Traitify Backend Service
//
//Develoopers - Hirely 2015


var config = require('../config');
var http = require('http');
var querystring = require('querystring');
var traitify = require('traitify');
var userModel = require('../models/user.model');


var traitifySevice = {
  getAssessmentId:function (next) {


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

  },

  getAll: function(query){
    var filters = {}
    if(undefined !== reqQuery.userId) {
        filters['_id'] = reqQuery.userId;
    }
    return applicationModel.find(filters).exec();
  },

}//// traitifyService


module.exports = traitifySevice;