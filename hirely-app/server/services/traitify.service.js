//Traitify Backend Service
//
//Develoopers - Hirely 2015


var config = require('../config');
var http = require('http');
var querystring = require('querystring');
var traitify = require('traitify');
var userModel = require('../models/user.model');
// var userModel = require('../models/user.model');
var q = require('q');

function extractPersonalitySummary(full){
    var summary = {};
    summary.personalityBlend = {};
    summary.personalityBlend.name = full.personalityBlend.name
    summary.personalityBlend.personalityTypes = [];
    summary.personalityBlend.personalityTypes.push({name:full.personalityBlend.personality_type_1.name});
    summary.personalityBlend.personalityTypes.push({name:full.personalityBlend.personality_type_2.name});

    summary.personalityTypes = [];
    for(var x=0; x<full.personalityTypes.length; x++){
        var type = full.personalityTypes[x];
        var typeSummary = {};
        typeSummary.score = type.score;
        typeSummary.name = type.personality_type.name;
        summary.personalityTypes.push(typeSummary);
    }

    summary.personalityTraits = [];
    for(var x=0; x<full.personalityTraits.length; x++){
        var trait = full.personalityTraits[x];
        var traitSummary = {};
        traitSummary.score = trait.score;
        traitSummary.name = trait.personality_trait.name;
        summary.personalityTraits.push(traitSummary);
    }

    return summary;
}//// fun. extract summary

/**
 * [traitifySevice Object to be exported as module]
 * @type {Object}
 */
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

  createNewAssessment: function(userId, examId, data){
    var deferred = q.defer()
    /**
     * Get summary for user
     */
    var summary = extractPersonalitySummary(data);
    summary.extId = examId;

    /**
     * Save summary to user profile
     */

    userModel.findById(userId).exec()
    .then(
      function(found){
        /**
         * User found update personality exam
         */
        found.personalityExams = [summary];

        found.save(function(err, obj){
          if(err){
            deferred.reject(err);
          }
          else{
            deferred.resolve(obj.personalityExams[0]);
          }
        })

      },//// fun. Resolve
      function(err){
        deferred.reject(err);
      }//// fun. reject
    )//// findById.then

    return deferred.promise;
  }

}//// traitifyService


module.exports = traitifySevice;