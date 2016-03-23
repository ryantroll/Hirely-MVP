'use strict';
var q = require('q');
var userModel = require('../models/user.model');
var onetScoresService = require('../services/onetScores.service');
var idMapModel = require('../models/useridmap.model');
var matchingService = require('../services/matching.service');
var bcrypt = require('bcrypt');


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
     * [getAll function will get all users.  Not to be used in production]
     * @return {[type]}        [promise]
     */
    getAll : function(reqQuery){
        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')
        if(undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }
        return userModel.find({}, returnFields).exec();
    },

    /**
     * [get function will get a user by id or slug]
     * @param  {[type]} id [user id should match user object id in DB]
     * @param  {[type]} reqQuery [req.query from service. if reqQuery.complete: return complete object]
     * @return {[type]}        [promise]
     */
    getById: function(id, reqQuery){
        // Determine what fields to return based on reqQuery.

        var returnFields = '';
        if(undefined !== reqQuery && undefined !== reqQuery.complete) {
            /**
             * Complete set is requested let's send the whole user object
             */


            returnFields = '-nothing';
        }
        else{

            /**
             * No complete set is requested
             * Checek of any property name is sent in query throuhg the below loop
             */
            for(var field in reqQuery){
                returnFields += '' + field + ' ';
            }

            /**
             * if no properties requested send the basic info
             */
            if(returnFields === ''){
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
    createNewUser : function(userObj){
        var salt = bcrypt.genSaltSync(10);
        userObj.password = bcrypt.hashSync(userObj.password, salt);
        var newUser = new userModel(userObj);

        /**
         * make sure basic info of user returned by the promise.
         */
        return newUser.save();
    },
    
    passwordLogin: function(email, password) {
        return userModel.findOne({email: email}).then(function(user) {
            if (!user) {
                console.log("passwordLogin: user not found for "+email);
                return null;
            }
            if(bcrypt.compareSync(password, user.password)) {
                return user;
            } else {
                console.log("passwordLogin: bad password for "+email);
                return null;
            }
        });
    },

    /**
     * [getUserByExternalId will take an external ID e.g. firebaseid and return the user basic info only]
     * @param  {[string]} extId [esternal id ]
     * @return {[promis]}       [description]
     */
    getUserByExternalId: function(extId, reqQuery){

        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')
        if(undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }

        return idMapModel.findOne({externalId:extId}).exec()
        .then(
            /**
             * map is found for this external id
             * find the user and return it in promise
             */
            function(map){
                return userModel.findById(map.localId, returnFields).exec();
            },//// fun. resolve
            function(error){
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
    saveUser: function(userId, userData){
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
            function(foundedUser){
                /**
                 * User exists in DB, do the update
                 */
                console.log(userData);
                if(foundedUser){
                    console.log("Found user");

                    /**
                     * Loop through sent properties and set them
                     */
                    for(var prop in userData){
                        console.log(prop);
                        foundedUser[prop] = userData[prop];

                        // Calc educationMax if education changed
                        // Calc if currently in school also
                        try {
                            if (prop == "education") {
                                foundedUser['educationStatus'] = "completed";
                                
                                if (userData['education'].length > 0) {
                                    var educationSortedByRank = userData['education'];
                                    educationSortedByRank.sort(function (a, b) {
                                        return educationProgramTypes.indexOf(a.programType) - educationProgramTypes.indexOf(b.programType)
                                    });
                                    foundedUser['educationMax'] = educationSortedByRank.pop();
                                    
                                    for (let program of userData['education']) {
                                        if (program.isCompleted == false) {
                                            foundedUser['educationStatus'] = "attending";
                                        }
                                    }
                                } else {
                                    // set to blank so that filters work
                                    foundedUser['educationMax'] = {}
                                }

                            }
                        } catch (error) {
                            console.log("Error calcing educationMax: "+error);
                            foundedUser['educationMax'] = {programType: null}
                        }

                    }//// for

                    foundedUser.lastModifiedOn = new Date();
                    console.log("Saving user");
                    foundedUser.save()
                    .then(
                        function(user){
                            console.log("User save success");
                            deferred.resolve(user);
                            console.dir(userData);
                            // if (userData.hasOwnProperty("workExperience")) {
                            //     console.log("Experience was updated, so updating user metrics");
                            //     userService.updateUserMetrics(user);
                            // }
                        },//// save() resolve
                        function(err){
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
            function(err){
                /**
                 * User doesn't exists
                 */
                deferred.reject("User trying to update doesn't exists");
            }
        );//// then

        return deferred.promise;
    },  //// fun. saveUser

    monthCountToExperienceLevel: function(monthCount) {
        if      (monthCount > 120) { return 120; }
        else if (monthCount > 96) { return 96; }
        else if (monthCount > 72) { return 72; }
        else if (monthCount > 48) { return 48; }
        else if (monthCount > 24) { return 24; }
        else if (monthCount > 12) { return 12; }
        else if (monthCount > 6) { return 6; }
        else if (monthCount > 3) { return 3; }
        else if (monthCount > 1) { return 1; }
        else { return 0; }
    },

    updateUserMetricsById: function(userId) {
        console.log("257");
        var self = this;
        return userModel.findById(userId).then(function(user) {
            return self.updateUserMetrics(user);
        });
    },

    updateUserMetrics: function(user) {
        console.log("258");


        // Clear the old Ksa
        console.log("259");
        for (let cat of ['Knowledge', 'Skills', 'Abilities', 'WorkActivities']) {
            user.scores[cat] = {};
        }

        // Concat roles
        var roles = {};
        var totalWorkMonths = 0;
        for (let workExperience of user.workExperience) {
            var occId = workExperience.occId;
            console.log("260");
            var monthCount = monthDiff(workExperience.dateStart, workExperience.dateEnd);
            totalWorkMonths += monthCount;

            // If role doesn't already exist, create it
            console.log("261.1");
            if (!(occId in roles)) {
                roles[occId] = {"monthCount": 0, "expLvl": 0};
            }

            console.log("261.2");
            roles[occId].monthCount += monthCount;
            roles[occId].expLvl = userService.monthCountToExperienceLevel(roles[occId].monthCount)
        }


        // Retrieve the role occupations from OnetScore
        console.log("262");
        var promises = [];
        for (var key in roles) {
            promises.push(onetScoresService.findById(key));
        }

        // Wait until retrieves are done
        return q.all(promises).then(function (occScoresArray) {
            console.log("262.5");

            // Extend roles with onet metrics
            for (let occScores of occScoresArray) {
                console.log("expLvl: "+ roles[occScores._id].expLvl);
                console.log("occId: "+ occScores._id);
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


            // Calc master KSAs
            console.log("263");
            var scores = {'Knowledge': {}, 'Skills': {}, 'Abilities': {}, 'WorkActivities': {}};
            for (var occId in roles) {
                console.log("264");
                // TODO:  Ask Dave if we should be using role.monthCount here instead of expLvl
                var weight = (roles[occId].monthCount / totalWorkMonths).toFixed(4);

                for (var category in roles[occId]) {
                    console.log("265");
                    for (var key in roles[occId][category]) {
                        console.log("266");
                        var weighted = Number(weight * roles[occId][category][key]).toFixed(4);
                        if (key in scores[category]) {
                            console.log("267");
                            scores[category][key] += weighted;
                        } else {
                            console.log("268");
                            scores[category][key] = weighted;
                        }
                    }
                }
            }  // end roles.forEach

            // Update user
            console.log("269");
            user.scores = scores;
            user.tenureAvg = 0;
            if (totalWorkMonths !== 0) {
                user.tenureAvg = Math.ceil(totalWorkMonths / user.workExperience.length);
            }
            console.log("270");
            return user.save().then(
                function (user) {
                    if (user.personalityExams.length > 0) {
                        return matchingService.generateCareerMatchScoresForUser(user);
                    } else {
                        return user;
                    }
                },
                function (error) {
                    console.log(error);
                }
            );


        })
        //    .catch(function (error) {
        //    console.dir(error);
        //    raise(error);
        //    // Do whatever happens if one or more errored
        //});  // end q.all()

    }  // end updateUserMetricsById

}; /// users object

module.exports = userService;