'use strict';
var q = require('q');
var onetScoresModel = require('../models/onetScores.model');


var onetScoresService = {
    onetScoresCache: {},

    getOnetScoreCategoryFromInternalCategory: function(cat) {
      // TODO:  Make interal cats = OnetScoreCats
      switch (cat) {
          case "knowledges":
              return "Knowledge";
          case "skills":
              return "Skills";
          case "abilities":
              return "Abilities";
          case "workActivities":
              return "WorkActivities";
      }
    },

    internalExperienceLevelToOnetScoresExperienceLvl: function(expLvl) {
        // TODO:  Ask dave to make this internal
        var lookup = {
            0: 0,
            1: 1,
            3: 2,
            6: 3,
            12: 4,
            24: 5,
            48: 6,
            64: 7,
            98: 8,
            124: 9
        };
        return lookup[expLvl];
    },

    getCache: function() {
        // Returns cached if cache is populated, otherwise gets it from db
        if (Object.keys(this.onetScoresCache).length === 0) {
            var self = this;
            return onetScoresModel.find({}).then(function (onetScoresAll) {
                for (let onetScores of onetScoresAll) {
                    self.onetScoresCache[onetScores._id] = onetScores;
                }
                return self.onetScoresCache
            });
        } else {
            var deferred = q.defer();
            deferred.resolve(this.onetScoresCache);
            return deferred.promise;
        }
    },

    getAll: function(){
        return this.getCache();
    },

    findById: function(occId){
        return this.getCache().then(function(onetScoresCache) {
            return onetScoresCache[occId];
        });
    }
}/// users object

module.exports = onetScoresService;