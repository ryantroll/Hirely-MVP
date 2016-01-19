//Traitify Backend Service
//
//Develoopers - Hirely 2015


var config = require('../config');
var http = require('http');
var querystring = require('querystring');
var traitify = require('traitify');
var userModel = require('../models/user.model');
var traitifyModel = require('../models/traitify.meta.model');
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

function saveEnvironment(env){
  var toSave = {};
  toSave.meta = {};
  toSave.metaId = env.id;
  toSave.metaName = env.name;
  toSave.metaType = 'environment';

  var envModel = traitifyModel(toSave);

  traitifyModel.findOne({metaId: toSave.metaId, metaType:'environment'}).exec()
  .then(
    function(founded){
      if(founded){
        /**
         * pdate existant
         */
        founded.meta = toSave.meta;
        founded.metaName = toSave.metaName;
        founded.save(function(err, savedEnv){
          // console.log(err);
        });
      }
      else{
        /**
         * Do a new instert
         */
        envModel.save(function(err, savedEnv){
          // console.log(err);
        });
      }

    }
  );/// .then
}/// fun. saveEviorme

function saveFamous(fam){
  // console.log(fam)
  var toSave = {};
  toSave.meta = {};
  toSave.metaId = fam.id;
  toSave.metaName = fam.name;
  toSave.metaType = 'famous_people';
  toSave.meta.picture = fam.picture;
  toSave.meta.description = fam.description;

  var famModel = traitifyModel(toSave);
  traitifyModel.findOne({metaId: toSave.metaId, metaType:'famous_people'}).exec()
  .then(
    function(founded){
      if(founded){
        /**
         * pdate existant
         */
        founded.meta = toSave.meta;
        founded.metaName = toSave.metaName;
        founded.save(function(err, savedFam){
          // console.log(err);
        });
      }
      else{
        /**
         * Do a new instert
         */
        famModel.save(function(err, savedFam){
          // console.log(err);
        });
      }

    }
  );/// .then

}/// fun. saveFamous

function extractTraitMeta(trait){
    // console.log(trait);
    var ret = {};
    ret.meta = {};
    ret.metaName = trait.personality_trait.name;
    ret.metaType = 'personality_trait';
    ret.meta.definition = trait.personality_trait.definition;
    ret.meta.personalityType = trait.personality_trait.personality_type.id;

    return ret;
}//// fun. extractTraitMeta


function extractTypeMeta(type){
    var ret = {};
    ret.meta = {};

    type = type.personality_type;

    ret.metaId = type.id;
    ret.metaType = 'personality_type';
    ret.metaName = type.name;


    ret.meta.keywords = type.keywords;
    ret.meta.details = type.details;

    ret.meta.environments = [];
    var envirs = type.environments;
    for(var x=0; x<envirs.length; x++){
        saveEnvironment(envirs[x])
        var envMeta = {};
        envMeta.id = envirs[x].id;
        ret.meta.environments.push(envMeta);
    }

    if(true === config.saveTraitifyFamousPeople){
      ret.meta.famousPeople = [];
      var fams = type.famous_people;
      for(var x=0; x<fams.length; x++){
          saveFamous(fams[x]);
          var famMeta = {};
          famMeta.id = fams[x].id;
          ret.meta.famousPeople.push(famMeta);
          // console.log(fams[x]);
      }////
    }//// if saveFamousPepole


    return ret;
}//// fun. extractTypeMeta

function extractBlendMeta(blend){
  var ret = {};
  ret.meta = {};
  // console.log(blend);

  ret.metaName = blend.name;
  ret.metaType = 'personality_blend'
  ret.meta.details = blend.details;
  ret.meta.description = blend.description
  return ret;
}//// fun. extractBlendMeta

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

  getAll: function(reqQuery){
    var filters = {}
    if(undefined !== reqQuery.userId) {
        filters['_id'] = reqQuery.userId;
    }
    return traitifyModel.find(filters).exec();
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

    /**
     * end this method if config option set to stop extracting traitify meta
     */
    if(false === config.extractTraitifyMeta) return deferred.promise;

    /**
     * Save Blend meta
     */
    var blend = extractBlendMeta(data.personalityBlend);

    traitifyModel.findOne({metaName:blend.metaName, metaType:'personality_blend'}).exec()
    .then(
      function(founded){

        if(null !== founded){
          founded.meta = blend.meta;
          founded.save(function(err, saved){
            if(err) deferred.reject(err);
          })
        }//// if null !== founded
        else{
          var newBlend = new traitifyModel(blend);
          newBlend.metaId = newBlend._id;
          newBlend.save(function(err, saved){
            if(err) deferred.reject(err);
          })
        }//// if null !== else
      }//// fun. resolve
    );/// then

    /**
     * Save Type meta
     */
    if(Array.isArray(data.personalityTypes) && data.personalityTypes.length > 0){
      var promises = data.personalityTypes.map(function(rawType){
        var type = extractTypeMeta(rawType);
        return q.ninvoke(traitifyModel, 'findOne', {metaId:type.metaId})
          .then(function(founded){
            if(founded){
              /**
               * Type is saved previously do update
               */

              founded.meta = type.meta;
              founded.metaName = type.metaName;
              founded.save(function(err, saved){
                if(err) deferred.reject(err);
              });
            }
            else{
              /**
               * Type is not there add new trait meta
               */
              var newType = new traitifyModel(type);
              newType.save(function(err, saved){
                if(err) deferred.reject(err);
              });
            }
          });//// q.nivoke.then()
      });//// map

      q.all(promises)
        .then(function(){
          // console.log('all types meta are saved');
        });
    }//// if array


      /**
       * Save Trait meta
       * Make sure to wait for asynchronous task through using Q promisses
       */

      if(Array.isArray(data.personalityTraits) && data.personalityTraits.length > 0){
        var promises = data.personalityTraits.map(function(rawTrait){
          var trait = extractTraitMeta(rawTrait);
          return q.ninvoke(traitifyModel, 'findOne', {metaName:trait.metaName})
          .then(function(founded){
            if(founded){
              /**
               * trait is saved previously do update
               */
              founded.meta = trait.meta;
              founded.metaName = trait.metaName;
              founded.save(function(err, saved){
                if(err) deferred.reject(err);
              });
            }
            else{
              /**
               * Trait is not there add new trait meta
               */
              var newTrait = new traitifyModel(trait);
              newTrait.metaId = newTrait._id;
              newTrait.save(function(err, saved){
                if(err) deferred.reject(err);
              });
            }
          });//// q.nivoke.then()
        });//// map

        q.all(promises)
        .then(function(){
          console.log('all traits meta are saved');
        });
      }//// if isArray

    return deferred.promise;
  }

}//// traitifyService


module.exports = traitifySevice;