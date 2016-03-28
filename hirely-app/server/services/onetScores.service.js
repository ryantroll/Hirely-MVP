'use strict';
var q = require('q');
var onetScoresModel = require('../models/onetScores.model');


var onetScoresService = {
    onetScoresCache: {},

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
    },

    findByIds: function(occIds){
        return this.getCache().then(function(onetScoresCache) {
            var result = [];
            for (let occId of occIds) {
                result.push(onetScoresCache[occId]);
            }
            return result;
        });
    }
}/// users object

module.exports = onetScoresService;