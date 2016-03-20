'use strict'
var Q = require('q');
var onetScoresService = require('../services/onetScores.service');
var userService = require('../services/user.service');
var Business = require('../models/business.model');
var User = require('../models/user.model');
var CareerMatchScores = require('../models/careerMatchScores.model');
var OnetScores = require('../models/onetScores.model');
var Applications = require('../models/application.model');

/**
 * Blockers:
 * - OnetScores aren't ready.  Waiting on Dave to finish
 * - Psy Career scores aren't ready. Waiting on traitify agreement to resolve
 */

var MatchService = {
    // I have this list, when you are ready;
    expLvls: [0, 1, 3, 6, 12, 24, 48, 72, 96, 120], // tiers of experience where level = num of months
    defaultExpWeight: .3,
    //defaultEduWeight: .1,
    defaultPsyWeight: .7,
    minimumSuggestionThreshold: 60,

    // This should be an api endpoint;
    // Generates a CareerMatchScores document for every onet occupation;
    generateCareerMatchScoresForUser: function(user) {
        //console.log("38");

        return CareerMatchScores.find({userId: user._id}).remove().then(function() {
            //console.log("39");

            return onetScoresService.getAll().then(function(onetScoresAll) {
                //console.log("40");
                var careerMatchScoresArray = [];
                var careerScores = user.personalityExams[0].careerMatchScores.toObject();
                var userScores = user.scores.toObject();
                for (var occId in onetScoresAll) {
                    var onetScoresInstance = onetScoresAll[occId].toObject();
                    //console.log("41");
                    var scores = {};
                    var maxOverallScore = 0;

                    for (let expLvl of MatchService.expLvls) {
                        //console.log("43");

                        scores[expLvl] = {exp:0, psy:0, overall:0};
                        var ss_user_all = [];
                        var ss_occ_all = [];

                        // Calc std deviation of ksaw
                        if (expLvl != 0) {
                            for (var category in userScores) {
                                try {
                                    userScores[category] = userScores[category].toObject();
                                } catch(err) {
                                    //console.log("User score didn't have toObject");
                                }
                                //console.log("44");
                                for (var key in userScores[category]) {
                                    var oScore = onetScoresInstance.scores[expLvl][category][key];
                                    ss_user_all.push(Math.pow(userScores[category][key] - oScore, 2));
                                    ss_occ_all.push(Math.pow(onetScoresInstance.scores[expLvl][category][key], 2));
                                }
                            }
                        }

                        // Calc Overall Experience score based on std deviations
                        //console.log("47");
                        if (ss_user_all.length === 0) {
                            expScore = 0;
                        } else {
                            var ss_user_all_sum = Number(ss_user_all.reduce(function(a, b) {return a + b;})).toFixed(4);
                            var ss_occ_all_sum = Number(ss_occ_all.reduce(function (a, b) {return a + b;})).toFixed(4);
                            var expScore = 1 - Number(Math.sqrt(ss_user_all_sum / ss_occ_all_sum)).toFixed(4);
                            expScore = Math.max(expScore, 0) * 100;
                        }
                        scores[expLvl].exp = Number(expScore).toFixed(2);

                        // Education calcs
                        //console.log("48");
                        //console.dir(occ[expLvl]);
                        //var eduScore = occ[expLvl].eduPercentiles[user.educationMaxLvl];
                        //scores[expLvl]['edu'] = eduScore;

                        // Personality calcs
                        //console.log("49");
                        var occIdTrans = onetScoresInstance._id.replace('.', ',');
                        var psyScore = careerScores[occIdTrans];
                        if (!psyScore) {
                            console.log("Career Score missing from traitify:  "+onetScoresInstance._id);
                            psyScore = 0;
                        }
                        scores[expLvl].psy = Number(psyScore).toFixed(2);

                        // Grand overallScore calcs;
                        //console.log("50");
                        var overallScore = expScore * MatchService.defaultExpWeight;
                        //overallScore += eduScore * MatchService.defaultEduWeight;
                        overallScore += psyScore * MatchService.defaultPsyWeight;
                        scores[expLvl].overall = Number(overallScore).toFixed(2);

                        //console.log("51");
                        if (overallScore > maxOverallScore) {
                            maxOverallScore = overallScore;
                        }

                    } // end this.expLvls.forEach

                    //console.log("52");
                    var careerMatchScoresDoc = {
                        userId:user._id,
                        occId:onetScoresInstance._id,
                        maxOverallScore:Number(maxOverallScore).toFixed(2),
                        scores:scores
                    };
                    // TODO:  Dump cms and try to create it in an area where I get errors.
                    careerMatchScoresArray.push(careerMatchScoresDoc);

                }  // end onetScores.forEach

                //return Q.all(promises);
                return CareerMatchScores.insertMany(careerMatchScoresArray).then(
                    function(docs) {
                        return true;
                    },
                    function(err) {
                        console.log("Erro:");
                        console.dir(err);
                    }
                );

            });  // end OnetScores.all.then
        });  // end CareerMatchScores.find.then

    },  // end generateForUser

    /**
     * This commented out and saved in case we want to bring it back.
     * Application scores were originally thought to be job specific based
     * on avail and possibly other factors, but we decided to keep the scores
     * constant and instead encourage the use of frontend filters.
     */

    //updateApplicationScores: function(application, user, business) {
    //
    //    var position = business.positions[application.positionId];
    //
    //    return CareerMatchScores.findOne(occId=position.occId, userId=userId).then(function(careerMatchScores) {
    //
    //        application.scores = careerMatchScores.scores[position.expLvl];
    //        application.scores.exp *= position.scoreWeights.exp;
    //        application.scores.edu *= position.scoreWeights.edu;
    //        application.scores.psy *= position.scoreWeights.psy;
    //
    //        // instead of id, to prevent unnecessary db calls
    //        //application.scores.qual = MatchService.getQualificationScore(user, business, position, 0);
    //        //application.scores.qual *= position.scoreWeights.qual;
    //
    //        application.scores.overall = Object.values(application.scores).sum();
    //        return application.save();
    //
    //    });  // end CareerMatchScores.findOne
    //
    //},  // end updateApplicationScores
    //
    //// This should be called when a position's qualification specification changes;
    //updateApplicationScoresForPosition: function(position) {
    //    return Applications.find({positionId: position._id}).then(function(applications) {
    //        var promises = [];
    //
    //        applications.forEach(function(application) {
    //            promises.push(User.findOne({id:application.userId}).then(function(user) {
    //                promises.push(MatchService.updateApplicationscores(application, user, position));
    //            }));
    //        });
    //
    //        return Q.all(promises)
    //    });
    //},
    //
    //// This should be called when a user's profile changes;
    //updateApplicationScoresForUser: function(user) {
    //    return Applications.find({'userId': user._id}).then(function(applications) {
    //        var promises = [];
    //
    //        applications.forEach(function(application) {
    //            promises.push(Business.findOne({ $where: "obj.positions['"+application.positionId+"']" }).then(function(business) {
    //                promises.push(MatchService.updateApplicationscores(application, user, business));
    //            }));
    //        });
    //
    //        return Q.all(promises)
    //    });
    //},


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

            return Business.find({hasOpenings:true, "location.city":user.city, "location.state":user.state}).then(function(businesses) {
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

                return Q.all(promises).then(function(suggestions) {
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