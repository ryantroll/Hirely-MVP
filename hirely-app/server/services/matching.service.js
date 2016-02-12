var Q = require('q');
var Business = require('../models/business.model');
var User = require('../models/user.model');
var CareerMatchCache = require('../models/careerMatchCache.model');
var OnetScore = require('../models/onetScore.model');

var MatchService = {
    // I have this list, when you are ready;
    expLvls:  [0, 3, 6, 12, 24, 48, 64, 98, 124], // tiers of experience where level = num of months
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

    // This should be an api endpoint, and should be called automatically when a profile is completed or when relevant fields are updated after completed;
    updateUserMatching: function(user) {

        // Education
        user.educationMaxLvl = 0;
        user.education.forEach(function(program) {
            // TODO: Make sure that program type numbers match up to onet, and that 2 = some college;
            if (program.programType > 1 && program.isCompleted == 0) {
                program.programType = 2;
            }
            if (program.programType > educationMaxLvl) {  // 0 = non edu, 1 = High School, 2 = Bachelors, 3 = Masters, 4 = PhD;
                user.educationMaxLvl = program.programType;
            }
        });


        // Clear the old Ksa
        user.knowledges = user.skills = user.abilities = user.workActivities = [];

        // Concat roles
        var roles = {};
        var totalWorkMonths = 0;
        var occIds = [];
        user.workExperiences.forEach(function (workExperience) {
            totalWorkMonths += workExperience.monthCount;
            occIds.push(workExperience.occId);

            // If role doesn't already exist, create it
            if (roles.indexOf(workExperience.occId) == -1) {
                roles[workExperience.occId] = {"monthCount": 0};
            }
            var role = roles[workExperience.occId];
            role.monthCount += workExperience.monthCount;
            role.expLvl = this.monthCountToExperienceLevel(role.monthCount)
        });


        // Retrieve the role occupations from OnetScore
        var promises = [];
        Object.keys(roles).forEach(function(key) {
            promises.push(OnetScore.findOne(key))
        });

        // Wait until retrieves are done
        Q.all(promises).then(function(occupations) {

            // Extend roles with onet metrics
            occupations.forEach(function(occupation) {
                var role = roles[occupation.occId]
                    ['knowledges', 'skills', 'abilities', 'workActivities'].forEach(function(category) {
                    role[category] = data[role.expLvl][category]
                });
            });


            // Calc master KSAs;
            roles.forEach(function(role) {
                // TODO:  Ask Dave if we should be using role.monthCount here instead of expLvl
                var weight = role.expLvl / totalWorkMonths;

                ['knowledges', 'skills', 'abilities', 'workActivities'].forEach(function(category) {
                    role[category].forEach(function(value, name) {
                        var weighted = weight * value;
                        if (user[category] === null) {
                            user[category][name] = weighted;
                        } else {
                            user[category][name] += weighted;
                        }
                    });
                });

            });  // end roles.forEach

            user.save();

            MatchService.updateApplicationScoresForUser(user);

        }).catch(function(error) {
            // Do whatever happens if one or more errored
        });  // end Q.all()

    },

    // This should be an api endpoint;
    // Generates a CareerMatchCache document for every onet occupation;
    generateCareerMatchCachesForUser: function(user) {

        CareerMatchCache.find({userId: user._id}).remove().then(function(err) {

            OnetScore.all().then(function(onetScores) {

                onetScores.forEach(function(occ) {

                    var careerMatchCache = new CareerMatchCache(userId=user._id, occId=occ._id);

                    MatchService.expLvls.forEach(function(expLvl) {

                        var ss_user_all = {};
                        var ss_occ_all = {};

                        // Calc std deviation of ksaw
                        ['knowledges', 'skills', 'abilities', 'workActivities'].forEach(function(category) {
                            Object.keys(user[category]).forEach(function(key) {
                                oScore = occ[expLvl][category][key]
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
                        overallScore += educationScore * MatchService.defaultEduWeight
                        overallScore += psyScore * MatchService.defaultPsyWeight;
                        careerMatchCache.scores[expLvl].overall = overallScore;

                        if (overallScore > careerMatchCache.maxOverallScore) {
                            careerMatchCache.maxOverallScore = overallScore;
                        };

                    }); // end this.expLvls.forEach

                    careerMatchCache.save();

                });  // end onetScores.forEach
            });  // end OnetScore.all.then
        });  // end CareerMatchCache.find.then
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

    getQualificationScore: function(user, business, position, disqualifyThreshold) {
        disqualifyThreshold = disqualifyThreshold || 0;

        var location = business.locations[position.locationId];
        var fScoreSum = 0;
        var fScoreMaxSum = 0;
        var disqualified = false;

        position.qualificationSpecification.formulas.forEach(function(formula) {
            var fScore = MatchService.qualificationFormulaEvaluator(formula, business, location, position, user);
            if (fScore > 0) {
                fScore = 1;
            }

            fScoreMaxSum += formula.importance;
            fScoreSum += fScore * formula.importance;

            if (fScore == 0 && formula.importance >= disqualifyThreshold) {
                disqualified = true;
            }
        });

        if (disqualified) {
            return 0;
        } else if (fScoreMaxSum == 0) {
            return 1;
        } else {
            return fScoreSum / fScoreMaxSum;
        }

    },  // end getQualificationScore

    updateApplicationScores: function(application, user, business) {

        var position = business.positions[application.positionId];

        CareerMatchCache.findOne(occId=position.occId, userId=userId).then(function(careerMatchCache) {

            application.scores = careerMatchCache.scores[position.expLvl];
            application.scores.exp *= position.scoreWeights.exp;
            application.scores.edu *= position.scoreWeights.edu;
            application.scores.psy *= position.scoreWeights.psy;

            // instead of id, to prevent unnecessary db calls
            application.scores.qual = MatchService.getQualificationScore(user, business, position, 0);

            application.scores.qual *= position.scoreWeights.qual;

            application.scores.overall = Object.values(application.scores).sum();
            application.save();

        });  // end CareerMatchCache.findOne

    },  // end updateApplicationScores

    // This should be called when a position's qualification specification changes;
    updateApplicationScoresForPosition: function(position) {
        Applications.find({positionId: position._id}).then(function(applications) {
            applications.forEach(function(application) {
                User.findOne({id:application.userId}).then(function(user) {
                    MatchService.updateApplicationscores(application, user, position);
                });
            });
        });
    },

    // This should be called when a user's profile changes;
    updateApplicationScoresForUser: function(user) {
        Applications.find({'userId': user._id}).then(function(applications) {
            applications.forEach(function(application) {
                Business.findOne({ $where: "obj.positions['"+application.positionId+"']" }).then(function(business) {
                    MatchService.updateApplicationscores(application, user, business);
                });
            });
        });
    },


    // This should be an api endpoint;
    getCareerSuggestions: function(userId, limit) {
        limit = limit || 100;
        return CareerMatchCache.find({'userId': userId, $limit: limit, $sort: {maxOverallScore: -1}}).exec()
    },  // end getUserSuggestions


    getUserSuggestionsForPosition: function(position) {

        suggestions = [];

        Applications.find({positionId:position._id}).then(function(applications) {

            priorApplicationUserIds = [];
            applications.forEach(function(application) {
                priorApplicationUserIds.push(application.userId);
            });

            Users.find({city:position.city, state:position.state, userId:{$nin:priorApplicationUserIds}}).then(function(users) {

                usersIndexedById = {};
                users.forEach(function(user) {
                    usersIndexedById[user._id] = user;
                };

                // Sort users by career match score and throw away users under minithres
                CareerMatchScores.find({occId:position.occId,
                    userId:{$in:Object.keys(usersIndexedById)},
                    scores[position.expLvl].overallScore: {$gte, MatchService.minimumSuggestionThreshold},
                    $sort:{scores[position.expLvl].overallScore: -1}
            })
                .then(function(careerMatchScores) {
                    careerMatchScores.forEach(function(careerMatchScore) {
                        user = usersIndexedById[careerMatchScore.userId];
                        suggestions.push({user:user, careerMatchScore:careerMatchScore});
                    });
                    return suggestions;
                });

            });

        });
    }


    getPositionSuggestionsForUser: function(user) {

        Applications.find({userId:user._id}).then(function(applications) {

            priorApplicationPositionIds = [];
            applications.forEach(function(application) {
                priorApplicationPositionIds.push(application.positionId);
            });

            businesses = Businesses.find({location.city:user.city, location.state:user.state}).then(function(businesses) {

                businesses.forEach(function(business) {
                    business.positions.forEach(function(position) {

                        // Filter out positions already applied to
                        if (priorApplicationPositionIds.indexOf(position._id) != -1) {

                            // Note:  position specific filters are applied on front end
                            // Sort positions by career match score and throw away positions under minimumSuggestionThreshold
                            // TODO:  Catch cms in local function to avoid dup lookups
                            CareerMatchScores.findOne({occId:position.occId, userId:userId}).then(function(careerMatchScore) {
                                if (careerMatchScore.scores[position.expLvl].overallScore > MatchService.minimumSuggestionThreshold) {
                                    suggestions.push({position:position, careerMatchScore:careerMatchScore});
                                }
                            });

                        };

                    });

                });

                // TODO: Need to sort by score
                return suggestions;

            });

        });
    }

};
