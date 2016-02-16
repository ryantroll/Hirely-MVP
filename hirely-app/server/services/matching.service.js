var Q = require('q');
var Business = require('../models/business.model');
var User = require('../models/user.model');
var CareerMatchScores = require('../models/careerMatchCache.model');
var OnetScore = require('../models/onetScore.model');

var MatchService = {
    // I have this list, when you are ready;
    expLvls: [0, 3, 6, 12, 24, 48, 64, 98, 124], // tiers of experience where level = num of months
    defaultExpWeight: .3,
    defaultEduWeight: .1,
    defaultPsyWeight: .3,
    minimumSuggestionThreshold: 60,

    monthCountToExperienceLevel: function(monthCount) {
        if      (monthCount > 124) { return 124 }
        else if (monthCount > 98) { return 98 }
        else if (monthCount > 64) { return 64 }
        else if (monthCount > 48) { return 48 }
        else if (monthCount > 24) { return 24 }
        else if (monthCount > 12) { return 12 }
        else if (monthCount > 6) { return 6 }
        else if (monthCount > 3) { return 3 }
        else if (monthCount > 1) { return 1 }
        else { return 0 }
    },

    // This should be an api endpoint;
    // Generates a CareerMatchScores document for every onet occupation;
    generateCareerMatchScoresForUser: function(user) {

        return CareerMatchScores.find({userId: user._id}).remove().then(function() {

            return OnetScore.all().then(function(onetScores) {

                var promises = [];

                onetScores.forEach(function(occ) {

                    var careerMatchCache = new CareerMatchScores(userId=user._id, occId=occ._id);

                    MatchService.expLvls.forEach(function(expLvl) {

                        var ss_user_all = {};
                        var ss_occ_all = {};

                        // Calc std deviation of ksaw
                        ['knowledges', 'skills', 'abilities', 'workActivities'].forEach(function(category) {
                            Object.keys(user[category]).forEach(function(key) {
                                var oScore = occ[expLvl][category][key]
                                ss_user_all[key] = Math.pow(user[category][key] - oScore, 2);
                            });
                            Object.keys(occ[expLvl][category]).forEach(function(key) {
                                ss_occ_all[key] = Math.pow(occ[expLvl][category][key], 2);
                            });
                        });
                        // Calc Overall Experience score based on std deviations
                        var expScore = 1 - Math.sqrt(ss_user_all / ss_occ_all);
                        // TODO:  Ask Dave why we need to do this?  Won't expScore always be > 0?
                        expScore = Math.max(expScore, 0);
                        careerMatchCache.scores[expLvl].exp = expScore;

                        // Education calcs
                        var eduScore = occ[expLvl].eduPercentiles[user.educationMaxLvl];
                        careerMatchCache.scores[expLvl].edu = eduScore;

                        // Personality calcs
                        var psyScore = user.personalityCareerScores[occId];
                        careerMatchCache.scores[expLvl].psy = psyScore;

                        // Grand overallScore calcs;
                        var overallScore = expScore * MatchService.defaultExpWeight;
                        overallScore += eduScore * MatchService.defaultEduWeight;
                        overallScore += psyScore * MatchService.defaultPsyWeight;
                        careerMatchCache.scores[expLvl].overall = overallScore;

                        if (overallScore > careerMatchCache.maxOverallScore) {
                            careerMatchCache.maxOverallScore = overallScore;
                        }

                    }); // end this.expLvls.forEach

                    promises.push(careerMatchCache.save());

                });  // end onetScores.forEach

                return Q.all(promises)

            });  // end OnetScore.all.then
        });  // end CareerMatchScores.find.then
    },  // end generateForUser

    qualificationComputer: function(operator, left, right) {
        switch (operator) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "/":
                return left / right;
            case "*":
                return left * right;
            case "%":
                return left % right;
            case "^":
                return Math.pow(left, right);
            case "within":
                left.forEach(function(element) {
                    if (right.indexOf(element) == -1) {
                        return 0;
                    }
                });
                return 1;
        }
    },


    qualificationFormulaEvaluator: function(formula, business, location, position, user) {
        var objLookup = {
            'business': business,
            'location': location,
            'position': position,
            'user': user
        };

        switch (formula.type) {
            case 'number':
            case 'string':
                return formula.value;
            case 'attribute':
                var parts = formula.value.split('.');
                var obj = objLookup[parts.shift()];
                var result = obj;
                parts.forEach(function(part) {
                    result = result[part];
                });
                return result;
            case 'computation':
                result = MatchService.qualificationFormulaEvaluator(formula.operands.shift(), business, location, position, user);
                formula.operands.forEach(function(operand) {
                    var intermediateResult = MatchService.qualificationFormulaEvaluator(operand, business, location, position, user);
                    result = MatchService.qualificationComputer(formula['operator'], result, intermediateResult);
                });
        }
        return result;
    },

    // This is not currently being used, but may be used in the future
    getQualificationScore: function(user, business, position) {

        var location = business.locations[position.locationId];
        var fScoreSum = 0;
        var fScoreMaxSum = 0;

        position.qualificationSpecification.formulas.forEach(function(formula) {
            var fScore = MatchService.qualificationFormulaEvaluator(formula, business, location, position, user);
            if (fScore > 0) {
                fScore = 1;
            }

            fScoreMaxSum += formula.importance;
            fScoreSum += fScore * formula.importance;
        });

        if (fScoreMaxSum == 0) {
            return 1;
        } else {
            return fScoreSum / fScoreMaxSum;
        }

    },  // end getQualificationScore

    // TODO:  Move this to frontend when ready
    // This function will likely need to be implemented front end at first, and backend later
    isUserFiltered: function(user, business, position, disqualifyThreshold) {
        disqualifyThreshold = disqualifyThreshold || 0;  // 0 is least important

        var location = business.locations[position.locationId];

        position.qualificationSpecification.formulas.forEach(function(formula) {
            var fScore = MatchService.qualificationFormulaEvaluator(formula, business, location, position, user);

            if (fScore == 0 && formula.importance >= disqualifyThreshold) {
                return true;
            }
        });

        return false;

    },  // end isUserFiltered

    updateApplicationScores: function(application, user, business) {

        var position = business.positions[application.positionId];

        return CareerMatchScores.findOne(occId=position.occId, userId=userId).then(function(careerMatchCache) {

            application.scores = careerMatchCache.scores[position.expLvl];
            application.scores.exp *= position.scoreWeights.exp;
            application.scores.edu *= position.scoreWeights.edu;
            application.scores.psy *= position.scoreWeights.psy;

            // Commented out factoring quals into scores.  Instead, they will be used as filters
            // instead of id, to prevent unnecessary db calls
            //application.scores.qual = MatchService.getQualificationScore(user, business, position, 0);
            //application.scores.qual *= position.scoreWeights.qual;

            application.scores.overall = Object.values(application.scores).sum();
            return application.save();

        });  // end CareerMatchScores.findOne

    },  // end updateApplicationScores

    // This should be called when a position's qualification specification changes;
    updateApplicationScoresForPosition: function(position) {
        return Applications.find({positionId: position._id}).then(function(applications) {
            var promises = [];

            applications.forEach(function(application) {
                promises.push(User.findOne({id:application.userId}).then(function(user) {
                    promises.push(MatchService.updateApplicationscores(application, user, position));
                }));
            });

            return Q.all(promises)
        });
    },

    // This should be called when a user's profile changes;
    updateApplicationScoresForUser: function(user) {
        return Applications.find({'userId': user._id}).then(function(applications) {
            var promises = [];

            applications.forEach(function(application) {
                promises.push(Business.findOne({ $where: "obj.positions['"+application.positionId+"']" }).then(function(business) {
                    promises.push(MatchService.updateApplicationscores(application, user, business));
                }));
            });

            return Q.all(promises)
        });
    },


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

            // TODO:  Add filter if user is active
            return User.find({city:position.city, state:position.state, userId:{$nin:priorApplicationUserIds}}).then(function(users) {

                var usersIndexedById = {};
                users.forEach(function(user) {
                    usersIndexedById[user._id] = user;
                });

                var cms_query_args = {
                    occId:position.occId,
                    userId:{$in:Object.keys(usersIndexedById)}
                };
                var overallScoreKey = "scores."+position.expLvl+".overallScore";
                cms_query_args[overallScoreKey][$gte] = MatchService.minimumSuggestionThreshold;
                cms_query_args[$sort][overallScoreKey] = -1;

                // Sort users by career match score and throw away users under minithres
                return CareerMatchScores.find(cms_query_args).then(function(careerMatchScores) {
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

            // TODO:  Filter out businesses with no open positions
            return Business.find({"location.city":user.city, "location.state":user.state}).then(function(businesses) {
                var promises = [];

                businesses.forEach(function(business) {
                    business.positions.forEach(function(position) {

                        // TODO:  Filter out positions with no openings

                        // Filter out positions already applied to
                        if (priorApplicationPositionIds.indexOf(position._id) != -1) {

                            // Note:  position specific filters are applied on front end
                            // Sort positions by career match score and throw away positions under minimumSuggestionThreshold
                            // TODO:  Catch cms in local function to avoid dup lookups
                            promises.push(CareerMatchScores.findOne({occId:position.occId, userId:userId}).then(function(careerMatchScore) {
                                if (careerMatchScore.scores[position.expLvl].overallScore > MatchService.minimumSuggestionThreshold) {
                                    suggestions.push({position:position, careerMatchScore:careerMatchScore});
                                }
                            }));

                        }

                    });

                });

                return Q.all(promises).then(function(suggestions) {
                    // TODO: Need to sort by score
                    return suggestions;
                });

            });

        });
    }

};
