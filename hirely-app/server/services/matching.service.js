'use strict'
var q = require('q');
var onetScoresService = require('../services/onetScores.service');
var UserService = require('../services/user.service');
var BusinessModels = require('../models/business.model.js'),
    PositionModel = BusinessModels.PositionModel,
    LocationModel = BusinessModels.LocationModel,
    BusinessModel = BusinessModels.BusinessModel;
var User = require('../models/user.model');
var CareerMatchScores = require('../models/careerMatchScores.model');
var OnetScores = require('../models/onetScores.model');
var Applications = require('../models/application.model');

var config = require('../config');
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');



/**
 * Blockers:
 * - OnetScores aren't ready.  Waiting on Dave to finish
 * - Psy Career scores aren't ready. Waiting on traitify agreement to resolve
 */

var MatchService = {
    // I have this list, when you are ready;
    expLvls: [0, 1, 3, 6, 12, 24, 48, 72, 96, 120], // tiers of experience where level = num of months
    defaultExpWeight: .5,
    //defaultEduWeight: .1,
    defaultPsyWeight: .5,
    minimumSuggestionThreshold: 60,

    // This should be an api endpoint;
    // Generates a CareerMatchScores document for every onet occupation;
    generateCareerMatchScoresForUser: function(user) {
        // console.log("ms38");

        // Ensure user's psy career scores are ready
        try {
            var careerScores = user.personalityExams[0].careerMatchScores.toObject();
        } catch(err) {
            var err = "SKIP MS:generateCareerMatchScoresForUser: missing personalityExam";
            console.log(err);
            deferred.reject(err);
            return deferred.promise;
        }

        return onetScoresService.getAll().then(function(onetScoresAll) {
            // console.log("ms40");

            try {
                var careerMatchScoresArray = [];
                var userScores = user.scores.toObject();
                for (var occId in onetScoresAll) {
                    var onetScoresInstance = onetScoresAll[occId].toObject();
                    // console.log("ms41");
                    var scores = {};
                    var maxOverallScore = 0;

                    for (let expLvl of MatchService.expLvls) {
                        // console.log("ms43");

                        scores[expLvl] = {exp: 0, psy: 0, overall: 0};
                        var ss_user_all = [];
                        var ss_occ_all = [];

                        // Calc std deviation of ksaw
                        for (var category in userScores) {
                            if (category == "_id") continue;
                            try {
                                userScores[category] = userScores[category].toObject();
                            } catch (err) {
                                // console.log("User score didn't have toObject");
                            }
                            // console.log("ms44");
                            for (var key in userScores[category]) {
                                var oScore = onetScoresInstance.scores[expLvl][category][key];
                                ss_user_all.push(Math.pow(userScores[category][key] - oScore, 2));
                                ss_occ_all.push(Math.pow(onetScoresInstance.scores[expLvl][category][key], 2));
                            }
                        }

                        // Calc Overall Experience score based on std deviations
                        // console.log("ms47");
                        if (ss_user_all.length === 0) {
                            console.log("MS:ERROR:ss_user_all.length === 0");
                            expScore = 0;
                        } else if (ss_occ_all.length === 0) {
                            console.log("MS:ERROR:ss_occ_all.length === 0");
                            expScore = 0;
                        } else {
                            var ss_user_all_sum = Math.round(ss_user_all.reduce(function (a, b) { return a + b; }) * 100) / 100;
                            var ss_occ_all_sum = Math.round(ss_occ_all.reduce(function (a, b) { return a + b; }) * 100) / 100;
                            var expScore = 1 - Math.round(Math.sqrt(ss_user_all_sum / ss_occ_all_sum) * 100) / 100;
                            expScore = Math.max(expScore, 0) * 100;
                        }
                        scores[expLvl].exp = String(Math.round(expScore * 100) / 100);

                        // Education calcs
                        // console.log("ms48");
                        //console.dir(occ[expLvl]);
                        //var eduScore = occ[expLvl].eduPercentiles[user.educationMaxLvl];
                        //scores[expLvl]['edu'] = eduScore;

                        // Personality calcs
                        // console.log("ms49");
                        var occIdTrans = onetScoresInstance._id.replace('.', ',');
                        var psyScore = careerScores[occIdTrans];
                        if (!psyScore) {
                            console.log("Career Score missing from traitify:  " + onetScoresInstance._id);
                            psyScore = 0;
                        }
                        scores[expLvl].psy = String(Math.round(psyScore * 100) / 100);

                        // Grand overallScore calcs;
                        // console.log("ms50");
                        var overallScore = expScore * MatchService.defaultExpWeight;
                        //overallScore += eduScore * MatchService.defaultEduWeight;
                        overallScore += psyScore * MatchService.defaultPsyWeight;
                        scores[expLvl].overall = String(Math.round(overallScore * 100) / 100);

                        // console.log("ms51");
                        if (overallScore > maxOverallScore) {
                            maxOverallScore = overallScore;
                        }

                    } // end this.expLvls.forEach

                    // console.log("ms52");
                    var careerMatchScoresDoc = {
                        createdAt: new Date(),
                        userId: String(user._id),
                        occId: String(onetScoresInstance._id),
                        maxOverallScore: String(Math.round(maxOverallScore * 100) / 100),
                        scores: scores
                    };
                    careerMatchScoresArray.push(careerMatchScoresDoc);

                }  // end onetScores.forEach

                // Do a direct db connection for speed
                console.log("Connecting to mongo");
                var deferred = q.defer();
                MongoClient.connect(config.mongoUri, function (err, db) {
                    try {
                        assert.equal(null, err);
                        var collection = db.collection('careerMatchScores');
                        console.log("MS: Deleting career match scores for user " + user._id);
                        collection.deleteMany({'userId': String(user._id)}, function (err, res) {
                            if (err != null) {
                                err = "Error in MS("+user._id+").deleteMany: "+err;
                                console.log(err);
                                db.close();
                                return;
                            }
                            console.log("Delete success. Creating career match scores for user " + user._id);
                            collection.insertMany(careerMatchScoresArray, function (err, res) {
                                if (err != null) {
                                    err = "Error in MS("+user._id+").insertMany: "+err;
                                    console.log(err);
                                    db.close();
                                    deferred.reject(err);
                                    return;
                                }
                                console.log("Created career match scores for user " + user._id);
                                deferred.resolve(true);
                                db.close();
                            });
                        });

                    } catch(err) {
                        err = "Error in MS1("+user._id+"): "+err;
                        console.log(err);
                        deferred.resolve(err);
                    }

                });
            
            } catch(err) {
                err = "Error in MS2(uid="+user._id+"): "+err;
                console.log(err);
                deferred.resolve(err);
            }

            return deferred.promise;

        });  // end OnetScores.all.then

    },  // end generateForUser


    // This should be an api endpoint;
    getCareerSuggestions: function(userId, limit) {
        limit = limit || 100;
        return CareerMatchScores.find({'userId': userId, $limit: limit, $sort: {maxOverallScore: -1}}).exec()
    },  // end getUserSuggestions


    getUserSuggestionsForPosition: function(position) {

        var suggestions = [];

        return Applications.find({positionId:position._id}).then(function(applications) {

            var priorApplicationUserIds = [];
            applications.forEach(function(application) {
                priorApplicationUserIds.push(application.userId);
            });

            return User.find({isVetted:true, "availability.isAvailable": true, city:position.city, state:position.state, userId:{$nin:priorApplicationUserIds}}).then(function(users) {

                var usersIndexedById = {};
                users.forEach(function(user) {
                    usersIndexedById[user._id] = user;
                });

                var filters = {
                    occId:position.occId,
                    userId:{$in:Object.keys(usersIndexedById)}
                };
                var overallScoreKey = "scores."+position.expLvl+".overallScore";
                filters[overallScoreKey][$gte] = MatchService.minimumSuggestionThreshold;
                filters[$sort][overallScoreKey] = -1;
                // Sort users by career match score
                return CareerMatchScores.find(filters).then(function(careerMatchScores) {
                    careerMatchScores.forEach(function(careerMatchScore) {
                        user = usersIndexedById[careerMatchScore.userId];
                        suggestions.push({user:user, careerMatchScore:careerMatchScore});
                    });
                    return suggestions;
                });

            });

        });
    },

    getPositionSuggestionsForUser: function(user) {

        var suggestions = [];

        return Applications.find({userId:user._id}).then(function(applications) {

            var priorApplicationPositionIds = [];
            applications.forEach(function(application) {
                priorApplicationPositionIds.push(application.positionId);
            });

            return BusinessModel.find({"location.city":user.city, "location.state":user.state}).then(function(businesses) {
                var promises = [];

                businesses.forEach(function(business) {
                    business.positions.forEach(function(position) {

                        // Filter out positions with no openings
                        if (position.openingsCount == 0) { return; }


                        // Filter out positions already applied to
                        if (priorApplicationPositionIds.indexOf(position._id) != -1) { return; }

                        // Note:  position specific filters are applied on front end
                        // Sort positions by career match score and throw away positions under minimumSuggestionThreshold
                        promises.push(CareerMatchScores.findOne({occId:position.occId, userId:userId}).then(function(careerMatchScore) {
                            if (careerMatchScore.scores[position.expLvl].overallScore > MatchService.minimumSuggestionThreshold) {
                                suggestions.push({position:position, fitScore:careerMatchScore.scores[position.expLvl].overallScore});
                            }
                        }));

                    });

                });

                return q.all(promises).then(function(suggestions) {
                    // Sort suggestions descending by fitScore
                    suggestions.sort(function(a, b) {
                        return b.fitScore - a.fitScore;
                    });
                    return suggestions;
                });

            });

        });
    }

};

module.exports = MatchService;