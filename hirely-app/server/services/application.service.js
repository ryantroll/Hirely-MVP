'use strict'
var applicationModel = require('../models/application.model');
var UserService = require('./user.service');
var userModel = require('../models/user.model');
var BusinessModels = require('../models/business.model.js'),
    PositionModel = BusinessModels.PositionModel,
    LocationModel = BusinessModels.LocationModel,
    BusinessModel = BusinessModels.BusinessModel;
var careerMatchScoresModel = require('../models/careerMatchScores.model');
var BusinessService = require('./business.service');
var q = require('q');

var applicationService = {

    statusLabelsHm: ['New', 'Pending', 'Applied', 'Liked', 'Hired', 'Dismissed', 'Surveying'],

    /**
     * [getById function will get a application by id]
     * @param  {[type]} id [application id should match application object id in DB]
     * @param  {[type]} reqQuery [req.query from service. if it's needed]
     * @return {[type]}        [promise]
     */
    getById: function (id, reqQuery) {
        var self = this;

        return applicationModel.findById(id).then(function (application) {
            console.log("as:getById:0");
            if (application) {
                console.log("as:getById:1");
                return userModel.findById(application.userId).then(function (user) {
                    console.log("as:getById:2");
                    return careerMatchScoresModel.findOne({userId: application.userId}).then(function (cms) {
                        console.log("as:getById:3");
                        var slimUser = self.convertUserToSlimObject(user);
                        console.log("as:getById:4");
                        var ret = {
                            application: application,
                            applicant: slimUser,
                            careerMatchScore: cms
                        };
                        console.log("as:getById:5");
                        return ret;
                    });
                });
            } else {
                console.log("as:getById:6");
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
    getByUserId: function (userId, reqQuery) {
        var filters = {userId: userId};
        if (undefined !== reqQuery.positionId) {
            filters['positionId'] = reqQuery.positionId;
        }
        return applicationModel.find(filters).exec();
    },

    convertUserToSlimObject: function (user) {
        var slimUser = user.toObject();
        if (slimUser.personalityExams && slimUser.personalityExams.length && slimUser.personalityExams[0].careerMatchScores)
            delete slimUser.personalityExams[0].careerMatchScores;
        // if (slimUser.scores)
        //     delete slimUser.scores;
        return slimUser;
    },

    /**
     * [getByPositionId will get applications and related users list that match a position id]
     * @param  {string} positionId [id of position]
     * @param  {object} reqQuery  [query string parameters]
     * @return {promise}           [description]
     */
    getByPositionId: function (positionId, reqQuery) {
        var self = this;

        // console.log("as:getByPositionId:0");
        return BusinessModel.findOne({$where: "obj.positions['" + positionId + "']"}).then(function (business) {
            // console.log("as:getByPositionId:1");
            var businessObj = business.toObject();
            var position = businessObj.positions[positionId];

            // console.log("as:getByPositionId:2");

            var query = {positionId: positionId};
            console.log('>>>>', query);
            return applicationModel.find(query).then(function (applications) {
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
                            //

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
    createNewApplication: function (appObj) {

        console.log("AS:createNewApplication:info:0");

        if (!appObj.userId && !appObj.user) {
            console.log("AS:createNewApplication:error:1");
            throw "Cannot create application without user info";
        }

        if (appObj.userId) {
            var userObj = {_id: appObj.userId};
        }
        else {
            var userObj = appObj.user;
            delete appObj.user;
        }

        var self = this;
        return userModel.findOne({email:userObj.email})
            // Get or create user, return user
            .then(function (user) {
                console.log("AS:createNewApplication:info:1");
                if (!user) {
                    user = new userModel(userObj);
                } else {
                    user.mobile = userObj.mobile;
                    user.preferences.communications.preferredMode = userObj.preferences.communications.preferredMode;
                }

                return user.save();

            })
            // Add userid to appObj, return application query
            .then(function (user) {
                console.log("AS:createNewApplication:info:2");
                appObj.userId = user._id;
                userObj = user;
                return applicationModel.findOne({userId: appObj.userId, positionId: appObj.positionId});
            })
            // Upsert and return application
            .then(function (application) {
                console.log("AS:createNewApplication:info:3");
                if (!application) {
                    application = new applicationModel(appObj);
                }

                var appliedAt = new Date();
                application.appliedAt = appliedAt;

                if (!application.history) {
                    application.history = [];
                }

                var statusFrom = application.status;
                var statusFromLabel = statusFrom!=undefined ? self.statusLabelsHm[statusFrom] : 'null';
                application.status = appObj.status ? appObj.status : 0;
                var statusToLabel = self.statusLabelsHm[application.status];
                console.log("AS:createNewApplication:info:4");
                application.history.push(
                    {
                        time: appliedAt,
                        type: 'StatusChange',
                        subject: "Status changed from " + statusFromLabel + " to " + statusToLabel,
                        body: "Status changed from " + statusFromLabel + " to " + statusToLabel,
                        meta: {
                            fromStatus: statusFrom,
                            toStatus: application.status
                        },
                        userId: userObj._id,
                        userFirstName: userObj.firstName,
                        userLastName: userObj.lastName
                    }
                );
                console.log("AS:createNewApplication:info:5");
                return application.save();

            });
    },

    /**
     * [saveApplication description]
     * @param  {string} appId  [Application ID to be updated, this function doesn't use mongoose .update() method because it doen't not rigger validation]
     * @param  {Object} appObj [Object that hold the properties of application that need to be updated]
     * @return {promise}        [description]
     */
    saveApplication: function (appId, appObj) {
        console.log("AS:saveApplication:info:0");
        return applicationModel.findOne({_id: appId}).exec()
            .then(
                function (foundedApp) {
                    console.log("AS:saveApplication:info:3");
                    if (foundedApp) {
                        console.log("AS:saveApplication:info:4");
                        for (var prop in appObj) {
                            console.log("AS:saveApplication:info:5");
                            foundedApp[prop] = appObj[prop];
                        }//// for
                        console.log("AS:saveApplication:info:6");
                        return foundedApp.save();
                    }//// if foundedApp
                    else {
                        console.error("AS:saveApplication:error:9");
                        throw 'Application coudn\'t be found with this Id';
                    }/// / if foundedApp else

                }/// fun. reolve

            )
    }
}; /// users object

module.exports = applicationService;