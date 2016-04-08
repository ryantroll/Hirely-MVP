'use strict';
var q = require('q');
var userModel = require('../models/user.model');
var onetScoresService = require('../services/onetScores.service');
var idMapModel = require('../models/useridmap.model');
var matchingService = require('../services/matching.service');
var traitifyService = require('../services/traitify.service');
var config = require('../config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var permissionModel = require('../models/permission.model');
var businessModel = require('../models/business.model');


/**
 * [privateFields array to define the names of private fields in user objects]
 * @type {Array}
 */
var privateFields = [
    'businessesAppliedTo',
    'businessesOwned',
    'businessesManaged',
    'businessesStaffOf',
    'personalityExams',
    'availability',
    'preferences',
    'workExperience',
    'education'
];

function monthDiff(d1, d2) {
    var months;
    if (isNaN(d2) || !d2) {
        d2 = new Date();
    }
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

var educationProgramTypes = ['High School', 'Certificate', 'Associate\'s Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Professional Degree', 'Doctoral Degree', 'Post-Doctoral Training'];


var userService = {

    /**
     * [get function will get a user by id or slug]
     * @param  {[type]} id [user id should match user object id in DB]
     * @param  {[type]} reqQuery [req.query from service. if reqQuery.complete: return complete object]
     * @return {[type]}        [promise]
     */
    getById: function (id, reqQuery) {
        // Determine what fields to return based on reqQuery.

        var returnFields = '';
        if (undefined !== reqQuery && undefined !== reqQuery.complete) {
            /**
             * Complete set is requested let's send the whole user object
             */


            returnFields = '-nothing';
        }
        else {

            /**
             * No complete set is requested
             * Checek of any property name is sent in query throuhg the below loop
             */
            for (var field in reqQuery) {
                returnFields += '' + field + ' ';
            }

            /**
             * if no properties requested send the basic info
             */
            if (returnFields === '') {
                returnFields = '-' + privateFields.join(' -')
            }
        }

        return userModel.findById(id, returnFields).exec();
    },

    /**
     * [createNewUser will create new user object in database]
     * @param  {[type]} userObj [JS object with required field in user Model]
     * @return {[type]}         [promise with user basic info]
     */
    createNewUser: function (userObj) {
        var self = this;

        if (userObj.password.length < 8) {
            var err = "Password length is too short";
            // console.log(err);
            throw err;
        }

        userObj.email = userObj.email.toLowerCase();
        var salt = bcrypt.genSaltSync(10);
        userObj.password = bcrypt.hashSync(userObj.password, salt);

        // Resolve perms if permToken present
        var perms = [];
        if (userObj.invitation) {
            try {
                var payload = jwt.verify(userObj.invitation, config.jwtSecret);
                if (!payload.permObjs) throw "Invitation is malformed";

                payload.permObjs.forEach(function(permDest) {
                    var perm = {
                        srcType: "users",
                        destType: permDest.destType,
                        destId: permDest.destId,
                        c: permDest.c, r: permDest.r, u: permDest.u, d: permDest.d
                    };
                    perms.push(perm);
                });

            } catch (err) {
                err = "US:createNewUser:error: "+err;
                console.error(err);
                deferred.reject(err);
                return;
            }
        }
        return userModel.create(userObj).then(function(user) {
            var userAndToken = self.getUserAndTokenObj(user, config.tokenLifeDefault);

            if (perms.length) {
                for (let perm of perms) {
                    perm.srcId = user._id;
                }
                return permissionModel.create(perms).then(function (perms) {
                    return userAndToken;
                });
            } else {
                return userAndToken;
            }
        });

    },

    createInvitationToken: function (permObjs, expiresIn) {
        // console.log("US:createInvitationToken:info:1");
        var token = jwt.sign({permObjs: permObjs}, config.jwtSecret, {expiresIn: expiresIn});
        return token;
    },
    createSimpleBusinessInvitationToken: function(businessId) {
        var permObj = {
            destType: 'businesses',
            destId: businessId,
            c: true, r: true, u: true, d: true
        };
        return this.createInvitationToken([permObj], '7d');
    },

    passwordLogin: function (email, password, skipPasswordCheck, isBusinessUser) {
        var self = this;

        try {
            email = email.toLowerCase();
        } catch(err) {
            // console.log("US:passwordLogin: email is malformed: " + email)
        }
        return userModel.findOne({email: email}).then(function (user) {
            try {
                if (!user) {
                    // console.log("US:passwordLogin: user not found for " + email);
                    return null;
                }
                
                if (skipPasswordCheck) {
                    return self.getUserAndTokenObj(user, config.tokenLifeDefault);
                }

                if (!user.password) {
                    // console.log("US:passwordLogin: user does not have a password");
                    return null;
                }

                // Check the password
                if (bcrypt.compareSync(password, user.password)) {
                    var expiresIn = config.tokenLifeDefault;
                    if (isBusinessUser) expiresIn = config.tokenLifeBusiness;
                    return self.getUserAndTokenObj(user, expiresIn);
                } else {
                    // console.log("US:passwordLogin: bad password for " + email);
                    return null;
                }
            } catch(err) {
                console.error("US:passwordLogin:error: " + err);
            }
        });
    },
    
    getUserAndTokenObj: function(user, expiresIn) {
        var token = jwt.sign({userId:user._id}, config.jwtSecret, {expiresIn: expiresIn});
        var exp = jwt.verify(token, config.jwtSecret).exp;
        return {token: {jwt: token, exp:exp}, user: user};
    },

    /**
     * [saveUser will update user in database after checking the existance of user by his id
     * this function create and manage its own promise
     * this function does NOT make use of model.update() method because it doesn't trigger schema validation]
     * @param  {string} userId   [id of user to be updated]
     * @param  {object} userData [object that hold properites that need to be updated]
     * @return {promise}          [promise]
     */
    saveUser: function (userId, userData) {
        var deferred = q.defer();

        var user = new userModel(userData);

        /**
         * Make sure the posted properties are valid properties
         */
        // userModel.schema.eachPath(function(path){
        //     // console.log(path);
        // });
        //

        /**
         * is the user exists in DB
         */
        userModel.findById(userId)
            .then(
                function (foundedUser) {
                    /**
                     * User exists in DB, do the update
                     */
                    // console.log(userData);
                    if (foundedUser) {
                        // console.log("US:saveUser:info: Found user");

                        /**
                         * Loop through sent properties and set them
                         */
                        for (var prop in userData) {
                            // console.log(prop);
                            foundedUser[prop] = userData[prop];
                        }//// for

                        foundedUser.lastModifiedOn = new Date();

                        if (userData.hasOwnProperty("workExperience")) {
                            // console.log("US:saveUser:info: Experience was updated, so updating user metrics");
                            foundedUser.queuedForMetricUpdate = true;
                        }

                        // console.log("Saving user");
                        foundedUser.save()
                            .then(
                                function (user) {
                                    // console.log("US:saveUser:info: User save success");
                                    deferred.resolve(user);
                                },//// save() resolve
                                function (err) {
                                    err = "US:saveUser:error: "+err;
                                    console.error(err);
                                    deferred.reject(err);
                                }
                            ); /// .save().then

                    }//// if user._id

                },//// fun. reslove
                function (err) {
                    err = "US:saveUser:error: "+err;
                    console.error(err);
                    deferred.reject(err);
                }
            );//// then

        return deferred.promise;
    },  //// fun. saveUser

    monthCountToExperienceLevel: function (monthCount) {
        if (monthCount > 120) {
            return 120;
        }
        else if (monthCount > 96) {
            return 96;
        }
        else if (monthCount > 72) {
            return 72;
        }
        else if (monthCount > 48) {
            return 48;
        }
        else if (monthCount > 24) {
            return 24;
        }
        else if (monthCount > 12) {
            return 12;
        }
        else if (monthCount > 6) {
            return 6;
        }
        else if (monthCount > 3) {
            return 3;
        }
        else if (monthCount > 1) {
            return 1;
        }
        else {
            return 0;
        }
    },

    addEduMetrics: function (user) {
        // console.log("US:addEduMetrics:info:0");
        // Calc educationMax if education changed
        // Calc if currently in school also
        try {
            user.educationStatus = "completed";
            // console.log("US:addEduMetrics:info:1");

            if (user.education.length > 0) {
                // console.log("US:addEduMetrics:info:1.1");
                var educationSortedByRank = user.education;
                // console.log("US:addEduMetrics:info:1.2");
                educationSortedByRank.sort(function (a, b) {
                    // console.log("US:addEduMetrics:info:1.3");
                    return educationProgramTypes.indexOf(a.programType) - educationProgramTypes.indexOf(b.programType)
                });
                // console.log("US:addEduMetrics:info:2");
                user.educationMax = educationSortedByRank.pop();

                // console.log("US:addEduMetrics:info:3");
                for (let program of user['education']) {
                    // console.log("US:addEduMetrics:info:4");
                    if (program.isCompleted == false) {
                        // console.log("US:addEduMetrics:info:5");
                        user.educationStatus = "attending";
                    }
                }
            } else {
                // console.log("US:addEduMetrics:info:6");
                // set to blank so that filters work
                user.educationMax = {};
                // console.log("US:addEduMetrics:info:6.1");
            }
        } catch (error) {
            console.error("US:addEduMetrics:error:1: " + error);
            user.educationMax = {programType: null}
        }
        // console.log("US:addEduMetrics:info:10");
        return user;
    },


    addExpScores: function (user, roles) {

        try {
            // Calc roles and tenure avg
            var roles = {};
            var totalWorkMonths = 0;
            var nonSeasonalTotalWorkMonths = 0;
            var nonSeasonalJobCount = 0;
            for (let workExperience of user.workExperience) {
                var occId = workExperience.occId;
                // console.log("US:addExpScores:info:260");
                var monthCount = monthDiff(workExperience.dateStart, workExperience.dateEnd);
                totalWorkMonths += monthCount;

                // If role doesn't already exist, create it
                // console.log("US:addExpScores:info:261.1");
                if (!(occId in roles)) {
                    roles[occId] = {"monthCount": 0, "expLvl": 0};
                }

                // console.log("US:addExpScores:info:261.2");
                roles[occId].monthCount += monthCount;
                roles[occId].expLvl = this.monthCountToExperienceLevel(roles[occId].monthCount);

                if (!workExperience.isSeasonal) {
                    nonSeasonalTotalWorkMonths += monthCount;
                    nonSeasonalJobCount += 1;
                }
            }

            // Add tenureAvg to user
            user.tenureAvg = 0;
            if (nonSeasonalTotalWorkMonths !== 0) {
                user.tenureAvg = Math.ceil(nonSeasonalTotalWorkMonths / nonSeasonalJobCount);
            }

            // console.log("US:addExpScores:info:262");
            return onetScoresService.findByIds(Object.keys(roles))
                .then(function (occScoresArray) {
                    // Extend roles with onet metrics

                    try {
                        // console.log("US:addExpScores:info:262.5");
                        for (let occScores of occScoresArray) {
                            // console.log("US:addExpScores:info:262.6");

                            var scores = occScores.scores;
                            try {
                                scores = scores.toObject();
                            } catch (err) {
                                console.warn("US:addExpScores:warn:0:  occScores.scores.toObject failed.  This is known to happen and usually indicates it's already an object")
                            }

                            // console.log("US:addExpScores:info:262.7");
                            var occScoresForExp = scores[roles[occScores._id].expLvl];
                            try {
                                occScoresForExp = occScoresForExp.toObject();
                            } catch (err) {
                                console.warn("US:addExpScores:warn:1:  occScoresForExp.toObject failed.  This is known to happen and usually indicates it's already an object")
                            }
                            
                            // console.log("US:addExpScores:info:262.8");
                            for (let cat of ['Knowledge', 'Skills', 'Abilities', 'WorkActivities']) {
                                roles[occScores._id][cat] = occScoresForExp[cat];
                                try {
                                    roles[occScores._id][cat] = roles[occScores._id][cat].toObject();
                                } catch (err) {
                                    console.warn("US:addExpScores:warn:2:  roles[occScores._id][cat].toObject failed.  This is known to happen and usually indicates it's already an object")
                                }
                            }
                        }
                    } catch(err) {
                        var err = "US:addExpScores:error:1("+user._id+"): "+err;
                        console.error(err);
                        var deferred = q.defer();
                        deferred.reject(err);
                        return deferred.promise;
                    }


                    return roles;
                }).then(function (roles) {
                    // Use roles to calc KSAW scores and add to user

                    try {
                        var totalWorkMonths = 0;
                        for (var occId in roles) {
                            totalWorkMonths += roles[occId].monthCount;
                        }

                        // Add master KSAs
                        // console.log("US:addExpScores:info:263");
                        var scores = {'Knowledge': {}, 'Skills': {}, 'Abilities': {}, 'WorkActivities': {}};
                        for (var occId in roles) {
                            // console.log("US:addExpScores:info:264");
                            // TODO:  Ask Dave if we should be using role.monthCount here instead of expLvl
                            var weight = roles[occId].monthCount / totalWorkMonths;
                            for (var category in roles[occId]) {
                                // console.log("US:addExpScores:info:265");
                                for (var key in roles[occId][category]) {
                                    // console.log("US:addExpScores:info:266");
                                    var weighted = weight * roles[occId][category][key];
                                    if (!(key in scores[category])) {
                                        scores[category][key] = 0;
                                    }
                                    scores[category][key] = Math.round(scores[category][key]+weighted * 100) / 100;
                                }
                            }
                        }  // end roles.forEach
                        // console.log("US:addExpScores:info:269");
                        user.scores = scores;

                        return user;
                    } catch(err) {
                        var err = "US:addExpScores:error:2("+user._id+"): "+err;
                        console.error(err);
                        var deferred = q.defer();
                        deferred.reject(err);
                        return deferred.promise;
                    }
                });

        } catch(err) {
            var err = "US:addExpScores:error:3("+user._id+"): "+err;
            console.error(err);
            var deferred = q.defer();
            deferred.reject(err);
            return deferred.promise;
        }
    },

    updateUserMetricsById: function (userId) {
        // console.log("US:updateUserMetricsById:info:257");
        var self = this;
        return userModel.findById(userId).then(function (user) {
            return self.updateUserMetrics(user);
        });
    },

    updateUserMetrics: function (user) {
        // console.log("US:updateUserMetrics:info:258");

        var self = this;

        // Set queuedForMetricUpdate = false to avoid race conditions (it's not perfect though)
        user.queuedForMetricUpdate = false;
        // Go ahead and add edu metrics since this is synchronous
        user = self.addEduMetrics(user);
        // console.log("US:updateUserMetrics:info:259");

        // var deferred = q.defer(); deferred.resolve(user); deferred.promise
        return user.save()
        .then(function (user) {
            // console.log("US:updateUserMetrics:info:260: " + user._id);
            return traitifyService.addTraitifyCareerMatchScoresToUser(user);
            // var deferred = q.defer(); deferred.resolve(user); return deferred.promise;
        }).then(function (user) {
            // console.log("US:updateUserMetrics:info:261: " + user._id);
            return self.addExpScores(user);
            // var deferred = q.defer(); deferred.resolve(user); return deferred.promise;
        }).then(function (user) {
            // console.log("US:updateUserMetrics:info:262: " + user._id);
            // var deferred = q.defer(); deferred.resolve(user); return deferred.promise;
            user.queuedForMetricUpdate = false;
            return user.save();
        }).then(function (user) {
            // console.log("US:updateUserMetrics:info:263: " + user._id);
            return matchingService.generateCareerMatchScoresForUser(user);
        })

    },  // end updateUserMetricsById

    updateQueuedUserMetricsLock: false,
    updateQueuedUserMetricsLastRan: 0,
    updateQueuedUserMetrics: function () {
        if (this.updateQueuedUserMetricsLock) {
            console.warn("US:updateQueuedUserMetrics:info: Waiting to finish");
            return;
        }

        this.updateQueuedUserMetricsLock = true;
        this.updateQueuedUserMetricsLastRan = Date.now();
        console.warn("US:updateQueuedUserMetrics:info: Start your crunching at " + (new Date()));

        var self = this;

        userModel.find({queuedForMetricUpdate:true}).then(function (users) {
        // return userModel.find({email: "personality@test.com"}).then(function (users) {
            var updateCount = users.length>3 ? 3 : users.length;
            console.warn("US:updateQueuedUserMetrics:info: Updating "+updateCount+"/"+users.length);
            var promises = [];
            try {
                for (let user of users) {
                    console.warn("US:updateQueuedUserMetrics:info: Updating: " + user.email);
                    promises.push(userService.updateUserMetrics(user));
                    if (promises.length > 3) {
                        break;
                    }
                }
                if (!users.length) {
                    console.warn("US:updateQueuedUserMetrics:info: None found");
                }
            } catch (err) {
                console.error("US:updateUserMetrics:updateQueuedUserMetrics:error: " + err);
            }

            return q.all(promises);
        }).then(
            function (results) {
                console.warn("US:updateQueuedUserMetrics:info: Lock lifted");
                self.updateQueuedUserMetricsLock = false;
            }, function (errs) {
                console.error("US:updateQueuedUserMetrics:error: Lock lifted with errors: " + errs);
                self.updateQueuedUserMetricsLock = false;
            }
        );
    }

}; /// users object

module.exports = userService;