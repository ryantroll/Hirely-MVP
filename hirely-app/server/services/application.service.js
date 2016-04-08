'use strict'
var applicationModel = require('../models/application.model');
var userService = require('./user.service');
var userModel = require('../models/user.model');
var businessModel = require('../models/business.model');
var careerMatchScoresModel = require('../models/careerMatchScores.model');
var businessService = require('./business.service');
var q = require('q');

function validateIds(userId, positionId){
    var deferred = q.defer();
    /**
     * First Check if user is a valid user
     */
    userService.getById(userId)
    .then(
        function(user){
            if(null !== user){
                /**
                 * User existes check if position is there with it's business object
                 */

                businessService.getByPositionId(positionId)
                .then(
                    function(business){
                        /**
                         * position ID exists is list of returned business more than 0
                         */
                        if(null !== business){
                            /**
                             * position is found announce
                             */

                            deferred.resolve(true);
                        }
                        else{
                            /**
                             * position not there
                             */
                            deferred.reject('position ID doesn\'t exists');
                        }

                    },//// getByPositionIid().then()
                    function(err){
                        console.log(err)
                    }
                )
            }//// if null !== user
            else{
                /**
                 * User couldn't be located
                 */
                deferred.reject('User ID doen\'t exists');
            }//// if null !== user else
        }///// fun. resolve
    )/// .then
    return deferred.promise;
}//// fun. validateIds


var applicationService = {

    /**
     * [getById function will get a application by id]
     * @param  {[type]} id [application id should match application object id in DB]
     * @param  {[type]} reqQuery [req.query from service. if it's needed]
     * @return {[type]}        [promise]
     */
    getById: function(id, reqQuery){
        var self = this;

        return applicationModel.findById(id).then(function(application) {
            if (application) {
                return userModel.findById(application.userId).then(function(user) {
                    return careerMatchScoresModel.findOne({userId:application.userId}).then(function(cms) {
                        var slimUser = self.convertUserToSlimObject(user);
                        var ret = {
                            application: application,
                            applicant: slimUser,
                            careerMatchScore: cms
                        };
                        return ret;
                    });
                });
            } else {
                throw "Application not found";
            }

        });
    },

    /**
     * [getByUserId will get applictions list that match the user id ]
     * @param  {string} userId   [id of user ]
     * @param  {ojbect} reqQuery [query string parameters]
     * @return {promise}          [description]
     */
    getByUserId: function(userId, reqQuery){
        var filters = {userId:userId};
        if(undefined !== reqQuery.positionId) {
            filters['positionId'] = reqQuery.positionId;
        }
        return applicationModel.find(filters).exec();
    },

    convertUserToSlimObject: function(user) {
        var slimUser = user.toObject();
        if (slimUser.personalityExams && slimUser.personalityExams.length && slimUser.personalityExams[0].careerMatchScores)
            delete slimUser.personalityExams[0].careerMatchScores;
        if (slimUser.scores)
            delete slimUser.scores;
        return slimUser;
    },

    /**
     * [getByPositionId will get applications and related users list that match a position id]
     * @param  {string} positionId [id of position]
     * @param  {object} reqQuery  [query string parameters]
     * @return {promise}           [description]
     */
    getByPositionId: function(positionId, reqQuery){
        var self = this;

        // console.log("as:getByPositionId:0");
        return businessModel.findOne({ $where: "obj.positions['"+positionId+"']" }).then(function(business) {
            // console.log("as:getByPositionId:1");
            var businessObj = business.toObject();
            var position = businessObj.positions[positionId];

            // console.log("as:getByPositionId:2");

            return applicationModel.find({'positionId': positionId}).then(function (applications) {
                // console.log("as:getByPositionId:3");
                var userIds = [];
                for (let application of applications) {
                    userIds.push(application.userId);
                }

                // console.log("as:getByPositionId:4");
                return userModel.find({_id: {$in: userIds}, queuedForMetricUpdate: false}).then(function (users) {

                    // console.log("as:getByPositionId:5");

                    return careerMatchScoresModel.find({userId: {$in: userIds}, occId: position.occId}).then(function (careerMatchScoress) {
                        // console.log("as:getByPositionId:6");

                        try {
                            var slimUsers = [];
                            users.forEach(function (user) {
                                var slimUser = self.convertUserToSlimObject(user);
                                slimUsers.push(slimUser);
                            });

                            var returnObj = {
                                applications: applications,
                                users: slimUsers,
                                careerMatchScoress: careerMatchScoress
                            };
                            // console.log("as:getByPositionId:6");

                            return returnObj;
                        } catch (err) {
                            err = "as:getByPositionId:err:" + err;
                            console.log(err);
                            throw err;
                        }
                    });

                });

            });
        });
    },  // end getByPositionId

    /**
     * [createNewApplication will insert a new application after it make sure user id and position id are valid by checking existance in database]
     * @param  {object} appObj [object that hold the properties of new applictaion to be insterted]
     * @return {promise}        [description]
     */
    createNewApplication: function(appObj){
        var deferred = q.defer();

        var newApplication = new applicationModel(appObj);

        /**
         * start with making sure ids of user and positions are exists in DB
         */
        validateIds(newApplication.userId, newApplication.positionId)
        .then(
            function(isValid){

                if(true === isValid){
                    /**
                     * IDs of user and position are valid go ahead and save
                     */
                    newApplication.save()
                    .then(
                        function(app){
                            deferred.resolve(app);
                        },
                        function(err){
                            deferred.reject(err);
                        }
                    )/// .save().then()
                }/// it isValid
                else{
                    /**
                     * this else will not be executed as validateIds will return only true
                     * Add for future
                     */
                     deferred.reject("User ID or position ID is not valid");
                }
            },//// fun. reslove
            function(err){
                /**
                 * One of the IDs is not valid reject the promise
                 */
                 deferred.reject(err);
            }//// fun. reject
        )///// validateIs.then()

        return deferred.promise;
    },

    /**
     * [saveApplication description]
     * @param  {string} appId  [Application ID to be updated, this function doesn't use mongoose .update() method because it doen't not rigger validation]
     * @param  {Object} appObj [Object that hold the properties of application that need to be updated]
     * @return {promise}        [description]
     */
    saveApplication: function(appId, appObj){
        var deferred = q.defer();

        // var newApplication = new applicationModel(appObj);

        validateIds(appObj.userId, appObj.positionId)
        .then(
            function(isValid){
                if(true === isValid){
                    applicationModel.findOne({_id: appId}).exec()
                    .then(
                        function(foundedApp){

                            if(null !== foundedApp){
                                /**
                                 * App is in Db do the save
                                 */

                                /**
                                 * Loop through sent properties and set them
                                 */
                                // delete foundedApp.prescreenAnswers;
                                for(var prop in appObj){
                                    foundedApp[prop] = appObj[prop];
                                }//// for

                                foundedApp.save()
                                  .then(
                                        function(savedApp){
                                            deferred.resolve(savedApp);
                                        },

                                        function(err){
                                            deferred.reject(err);
                                        }
                                    )/// save.then
                            }//// if foundedApp
                            else{
                                /**
                                 * Error in finding application
                                 */
                                deferred.reject('Application coudn\'t be found with this Id');
                            }/// / if foundedApp else

                        }/// fun. reolve

                    )//// find.then()
                }/// it isValid
                else{
                    /**
                     * This else will not be executed because validateIds return only true
                     */
                    deferred.reject("User ID or position ID is not valid");
                }/// i isValid else
            },//// fun. reslove
            function(err){
                /**
                 * One of the IDs are not valid reject the promise
                 */
                deferred.reject(err);
            }//// fun. reject
        )///// validateIs.then()

        return deferred.promise;
    }
}/// users object

module.exports = applicationService;