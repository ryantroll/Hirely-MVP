'use strict';
var q = require('q');
var userModel = require('../models/user.model');
var onetScoresService = require('../services/onetScores.service');
var idMapModel = require('../models/useridmap.model');
var matchingService = require('../services/matching.service');


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
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}


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
        var newUser = new userModel(userObj);

        /**
         * make sure basic info of user returned by the promise.
         */
        return newUser.save()
        .then(
            function(user){
                /**
                 * Add Mapping entry if external user id is sent with userObject
                 */

                if(undefined !== userObj.externalId && '' !== userObj.externalId){
                    var idMap = new idMapModel({localId:user._id, externalId:userObj.externalId});
                    /**
                     * make sure there is one map for each local user id
                     */
                    idMapModel.remove({localId:user._id})
                    .then(
                        function(){
                            /**
                             * Id Map removed successfully before insterting new one
                             * go ahead and insert new one
                             */
                            return idMap.save()
                            .then(
                                function(map){
                                    console.log(map)
                                    return userModel.findById(map.localId).exec();
                                },/// fun. idMap.save reslove
                                function(err){
                                    /**
                                     * Error in updateing ID map entry
                                     */
                                    return userModel.findById(map.localId).exec();
                                    console.log('Error in saving idMap for new user');
                                    console.log(err);
                                } /// fun. idMap.save reject
                            );//// then
                        },/// fun. remove reslove
                        function(err){
                            /**
                             * Error in remving idMap
                             * still find the user object and return it
                             */
                            return userModel.findById(user._id).exec();
                            console.log('error in removing idMap in prepration for new insert');
                            console.log(err);
                        }//// fun. remove reject
                    );/// remove then

                }
                else{
                    return userModel.findById(user._id).exec();
                }
            }//// then fun.
        )/// then
        .then(

        )
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
        var deferred = q.defer()

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
        userModel.findOne({_id:userId})
        .then(
            function(foundedUser){
                /**
                 * User exists in DB, do the update
                 */
                //console.log(userData);
                if(foundedUser){
                    //console.log("Found user");

                    /**
                     * Loop through sent properties and set them
                     */
                    for(var prop in userData){
                        console.log(prop);
                        foundedUser[prop] = userData[prop];
                    }//// for

                    foundedUser.lastModifiedOn = new Date();
                    //console.log("Saving user");
                    foundedUser.save()
                    .then(
                        function(user){
                            console.log("User save success");
                            deferred.resolve(user);
                        },//// save() resolve
                        function(err){
                            /**
                             * Error in updating user
                             */
                            console.log(err);
                            console.log('Error: user couldn\'t be updated');
                            deferred.reject(err);
                        }
                    ) /// .save().then

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

    updateUserMetrics: function(userId) {
        //console.log("257");

        return userModel.findById(userId).then(function(user) {
            //console.log("258");

            // Education
            user.educationMaxLvl = 0;
            user.education.forEach(function (program) {
                // TODO: Make sure that program type numbers match up to onet, and that 2 = some college;
                if (program.programType > 1 && program.isCompleted == 0) {
                    program.programType = 2;
                }
                if (program.programType > educationMaxLvl) {  // 0 = non edu, 1 = High School, 2 = Bachelors, 3 = Masters, 4 = PhD;
                    user.educationMaxLvl = program.programType;
                }
            });


            // Clear the old Ksa
            //console.log("259");
            for (let cat of ['Knowledge', 'Skills', 'Abilities', 'WorkActivities']) {
                user.scores[cat] = {};
            };

            // Concat roles
            var roles = {};
            var totalWorkMonths = 0;
            for (let workExperience of user.workExperience) {
                var occId = workExperience.onetOccupationId;
                //console.log("260");
                var monthCount = monthDiff(workExperience.dateStart, workExperience.dateEnd);
                totalWorkMonths += monthCount;

                // If role doesn't already exist, create it
                if (!(occId in roles)) {
                    roles[occId] = {"monthCount": 0, "expLvl": 0};
                }

                roles[occId].monthCount += monthCount;
                roles[occId].expLvl = userService.monthCountToExperienceLevel(roles[occId].monthCount)
            }


            // Retrieve the role occupations from OnetScore
            //console.log("261");
            var promises = [];
            for (var key in roles) {
                promises.push(onetScoresService.findById(key));
            }

            // Wait until retrieves are done
            return q.all(promises).then(function (occScoresArray) {
                //console.log("262");

                // Extend roles with onet metrics
                for (let occScores of occScoresArray) {
                    var occScoresForExp = occScores.scores[roles[occScores._id].expLvl].toObject();
                    for (let cat of ['Knowledge', 'Skills', 'Abilities', 'WorkActivities']) {
                        roles[occScores._id][cat] = occScoresForExp[cat].toObject();
                    }
                }


                // Calc master KSAs
                //console.log("263");
                var scores = {'Knowledge': {}, 'Skills': {}, 'Abilities': {}, 'WorkActivities': {}};
                for (var occId in roles) {
                    //console.log("264");
                    // TODO:  Ask Dave if we should be using role.monthCount here instead of expLvl
                    var weight = (roles[occId].monthCount / totalWorkMonths).toFixed(4);

                    for (var category in roles[occId]) {
                        //console.log("265");
                        for (var key in roles[occId][category]) {
                            //console.log("266");
                            var weighted = Number(weight * roles[occId][category][key]).toFixed(4);
                            if (key in scores[category]) {
                                //console.log("267");
                                scores[category][key] += weighted;
                            } else {
                                //console.log("268");
                                scores[category][key] = weighted;
                            }
                        }
                    }
                }  // end roles.forEach
                user.scores = scores;

                //console.log("269");
                return user.save().then(
                    function (user) {
                        return matchingService.generateCareerMatchScoresForUser(user);
                    },
                    function (error) {
                        console.log(error);
                    }
                );


            }).catch(function (error) {
                console.dir(error);
                raise(error);
                // Do whatever happens if one or more errored
            });  // end q.all()

        }); // end find user

    }  // end updateUserMetrics

}; /// users object

module.exports = userService;