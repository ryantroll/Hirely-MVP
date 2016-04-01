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

        if (userObj.password.length < 8) {
            var err = "Password length is too short";
            console.log(err);
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
                console.dir("Invite error: " + err);
                deferred.reject(err);
                return;
            }
        }
        return userModel.create(userObj).then(function(user) {
            var token = jwt.sign({userId: user._id}, config.jwtSecret, {expiresIn: '1h'});
            var userAndToken = {token: token, user: user};

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
        // console.log("createInvitationToken");
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
        try {
            email = email.toLowerCase();
        } catch(err) {
            console.log("US:passwordLogin: email is malformed: " + email)
        }
        return userModel.findOne({email: email}).then(function (user) {
            if (!user) {
                console.log("US:passwordLogin: user not found for " + email);
                return null;
            }

            if (skipPasswordCheck) {
                var token = jwt.sign({userId:user._id}, config.jwtSecret, {expiresIn: '1h'});
                return {token: token, user: user};
            }

            if (!user.password) {
                console.log("US:passwordLogin: user does not have a password");
                return null;
            }

            // Check the password
            if (bcrypt.compareSync(password, user.password)) {
                // Create a token
                // If user is a business user, make cookie last longer
                var expiresIn = '1h';
                if (isBusinessUser) expiresIn = '1 month';
                var token = jwt.sign({userId:user._id}, config.jwtSecret, {expiresIn: expiresIn});
                return {token: token, user: user};
            } else {
                console.log("US:passwordLogin: bad password for " + email);
                return null;
            }
        });
    },

    /**
     * [getUserByExternalId will take an external ID e.g. firebaseid and return the user basic info only]
     * @param  {[string]} extId [esternal id ]
     * @return {[promis]}       [description]
     */
    getUserByExternalId: function (extId, reqQuery) {

        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')
        if (undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }

        return idMapModel.findOne({externalId: extId}).exec()
            .then(
                /**
                 * map is found for this external id
                 * find the user and return it in promise
                 */
                function (map) {
                    return userModel.findById(map.localId, returnFields).exec();
                },//// fun. resolve
                function (error) {
                    /**
                     * No map is found for this external id
                     */
                    console.log(error);
                }//// fun. reject
            )//// then

    }, //// fun. getUserByExternalId


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
        //     console.log(path);
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
                    console.log(userData);
                    if (foundedUser) {
                        console.log("Found user");

                        /**
                         * Loop through sent properties and set them
                         */
                        for (var prop in userData) {
                            console.log(prop);
                            foundedUser[prop] = userData[prop];
                        }//// for

                        foundedUser.lastModifiedOn = new Date();

                        if (userData.hasOwnProperty("workExperience")) {
                            console.log("Experience was updated, so updating user metrics");
                            foundedUser.queuedForMetricUpdate = true;
                        }

                        console.log("Saving user");
                        foundedUser.save()
                            .then(
                                function (user) {
                                    console.log("User save success");
                                    deferred.resolve(user);
                                },//// save() resolve
                                function (err) {
                                    /**
                                     * Error in updating user
                                     */
                                    console.log(err);
                                    console.log('Error: user couldn\'t be updated');
                                    deferred.reject(err);
                                }
                            ); /// .save().then

                    }//// if user._id

                },//// fun. reslove
                function (err) {
                    /**
                     * User doesn't exists
                     */
                    deferred.reject("User trying to update doesn't exists");
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
        // Calc educationMax if education changed
        // Calc if currently in school also
        try {
            user['educationStatus'] = "completed";

            if (user['education'].length > 0) {
                var educationSortedByRank = user['education'];
                educationSortedByRank.sort(function (a, b) {
                    return educationProgramTypes.indexOf(a.programType) - educationProgramTypes.indexOf(b.programType)
                });
                user['educationMax'] = educationSortedByRank.pop();

                for (let program of user['education']) {
                    if (program.isCompleted == false) {
                        user['educationStatus'] = "attending";
                    }
                }
            } else {
                // set to blank so that filters work
                user['educationMax'] = {}
            }
        } catch (error) {
            console.log("Error calcing educationMax: " + error);
            user['educationMax'] = {programType: null}
        }
        return user;
    },


    addExpScores: function (user, roles) {

        try {
            // Calc roles
            var roles = {};
            var totalWorkMonths = 0;
            for (let workExperience of user.workExperience) {
                var occId = workExperience.occId;
                // console.log("us260");
                var monthCount = monthDiff(workExperience.dateStart, workExperience.dateEnd);
                totalWorkMonths += monthCount;

                // If role doesn't already exist, create it
                // console.log("us261.1");
                if (!(occId in roles)) {
                    roles[occId] = {"monthCount": 0, "expLvl": 0};
                }

                // console.log("us261.2");
                roles[occId].monthCount += monthCount;
                roles[occId].expLvl = this.monthCountToExperienceLevel(roles[occId].monthCount)
            }

            // console.log("us262");
            return onetScoresService.findByIds(Object.keys(roles))
                .then(function (occScoresArray) {
                    // Extend roles with onet metrics

                    try {
                        // console.log("us262.5");
                        for (let occScores of occScoresArray) {
                            console.log("expLvl: " + roles[occScores._id].expLvl);
                            console.log("occId: " + occScores._id);
                            //console.dir(occScores.scores);

                            //console.dir("")
                            var scores = occScores.scores;
                            try {
                                scores = scores.toObject()
                            } catch (err) {
                                console.log("Warning:  occScores.scores.toObject failed.  This is known to happen and usually indicates it's already an object")
                            }
                            var occScoresForExp = scores[roles[occScores._id].expLvl];
                            try {
                                occScoresForExp = occScoresForExp.toObject();
                            } catch (err) {
                                console.log("Warning:  occScoresForExp.toObject failed.  This is known to happen and usually indicates it's already an object")
                            }
                            for (let cat of ['Knowledge', 'Skills', 'Abilities', 'WorkActivities']) {
                                roles[occScores._id][cat] = occScoresForExp[cat];
                                try {
                                    roles[occScores._id][cat] = roles[occScores._id][cat].toObject();
                                } catch (err) {
                                    console.log("Warning:  roles[occScores._id][cat].toObject failed.  This is known to happen and usually indicates it's already an object")
                                }
                            }
                        }
                    } catch(err) {
                        var err = "ERROR US:addExpScores("+user._id+"): "+err;
                        console.log(err);
                        var deferred = q.defer(err);
                        deferred.resolve(user);
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

                        // Add tenureAvg to user
                        user.tenureAvg = 0;
                        if (totalWorkMonths !== 0) {
                            user.tenureAvg = Math.ceil(totalWorkMonths / user.workExperience.length);
                        }

                        // Add master KSAs
                        // console.log("us263");
                        var scores = {'Knowledge': {}, 'Skills': {}, 'Abilities': {}, 'WorkActivities': {}};
                        for (var occId in roles) {
                            // console.log("us264");
                            // TODO:  Ask Dave if we should be using role.monthCount here instead of expLvl
                            var weight = (roles[occId].monthCount / totalWorkMonths).toFixed(4);
                            for (var category in roles[occId]) {
                                // console.log("us265");
                                for (var key in roles[occId][category]) {
                                    // console.log("us266");
                                    var weighted = Number(weight * roles[occId][category][key]).toFixed(4);
                                    if (key in scores[category]) {
                                        // console.log("us267");
                                        scores[category][key] += weighted;
                                    } else {
                                        // console.log("us268");
                                        scores[category][key] = weighted;
                                    }
                                }
                            }
                        }  // end roles.forEach
                        // console.log("us269");
                        user.scores = scores;

                        return user;
                    } catch(err) {
                        var err = "ERROR US:addExpScores("+user._id+"): "+err;
                        console.log(err);
                        var deferred = q.defer(err);
                        deferred.resolve(user);
                        return deferred.promise;
                    }
                });

        } catch(err) {
            var err = "ERROR US:addExpScores("+user._id+"): "+err;
            console.log(err);
            var deferred = q.defer(err);
            deferred.resolve(user);
            return deferred.promise;
        }
    },

    updateUserMetricsById: function (userId) {
        // console.log("us257");
        var self = this;
        return userModel.findById(userId).then(function (user) {
            return self.updateUserMetrics(user);
        });
    },

    updateUserMetrics: function (user) {
        // console.log("us258");

        var self = this;

        // Set queuedForMetricUpdate = false to avoid race conditions (it's not perfect though)
        user.queuedForMetricUpdate = false;
        // Go ahead and add edu metrics since this is synchronous
        user = self.addEduMetrics(user);
        console.log("u259");

        // var deferred = q.defer(); deferred.resolve(user); deferred.promise
        user.save()
        .then(function (user) {
            console.log("u260");
            return traitifyService.addTraitifyCareerMatchScoresToUser(user);
        }).then(function (user) {
            console.log("u261");
            return self.addExpScores(user);
        }).then(function (user) {
            console.log("u262");
            // var deferred = q.defer(); deferred.resolve(user); return deferred.promise;
            user.queuedForMetricUpdate = false;
            return user.save();
        }).then(function (user) {
            console.log("u263");
            return matchingService.generateCareerMatchScoresForUser(user);
        }).then(function (boolResult) {
            console.log("u264");
            return true;
        })

    }  // end updateUserMetricsById

}; /// users object

module.exports = userService;