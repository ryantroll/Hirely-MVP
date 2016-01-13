var applicationModel = require('../models/application.model');
var userService = require('./user.service');
var businessService = require('./business.service');
var q = require('q');

function validateIds(userId, variantId){
    var deferred = q.defer();
    /**
     * First Check if user is a valid user
     */
    userService.getById(userId)
    .then(
        function(user){
            /**
             * User existes check if variant is there with it's business object
             */
            businessService.getByVariantId(variantId)
            .then(
                function(business){
                    /**
                     * Variant ID exists is list of returned business more than 0
                     */
                    if(business.length > 0){
                        /**
                         * variant is found announce
                         */

                        deferred.resolve(true);
                    }
                    else{
                        /**
                         * Variant not there
                         */
                        deferred.reject('Variant ID doesn\'t exists');
                    }

                },
                function(error){
                    /**
                     * No business found with variant ID
                     */
                    deferred.reject('Variant ID doesn\'t exists');
                }
            )
        },
        function(err){
            deferred.reject('User ID doesn\'t exists');
        }
    )/// .then
    return deferred.promise;
}//// fun. validateIds


var applicationService = {
    /**
     * [getAll function will get all applications.  Not to be used in production]
     * @return {[type]}        [promise]
     */
    getAll : function(reqQuery){
        var filters = {}
        if(undefined !== reqQuery.userId) {
            filters['userId'] = reqQuery.userId;
        }
        if(undefined !== reqQuery.variantId) {
            filters['variantId'] = reqQuery.variantId;
        }
        if(undefined !== reqQuery.status) {
            filters['status'] = reqQuery.status;
        }
        return applicationModel.find(filters).exec();
    },

    /**
     * [getById function will get a application by id]
     * @param  {[type]} id [application id should match application object id in DB]
     * @param  {[type]} reqQuery [req.query from service. if it's needed]
     * @return {[type]}        [promise]
     */
    getById: function(id, reqQuery){
        return applicationModel.findById(id).exec();
    },

    /**
     * [getByUserId will get applictions list that match the user id ]
     * @param  {string} userId   [id of user ]
     * @param  {ojbect} reqQuery [query string parameters]
     * @return {promise}          [description]
     */
    getByUserId: function(userId, reqQuery){
        return applicationModel.find({userId:userId}).exec();
    },

    /**
     * [getByVariantId will get applications list that match a variant id]
     * @param  {string} variantId [id of variant]
     * @param  {object} reqQuery  [query string parameters]
     * @return {promise}           [description]
     */
    getByVariantId: function(variantId, reqQuery){
        return applicationModel.find({variantId:variantId}).exec();
    },

    createNewApplication: function(appObj){
        var deferred = q.defer();

        var newApplication = new applicationModel(appObj);

        validateIds(newApplication.userId, newApplication.variantId)
        .then(
            function(isValid){
                if(true === isValid){
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
                     deferred.reject("User ID or variant ID is not valid");
                }
            },//// fun. reslove
            function(err){
                 deferred.reject(err);
            }//// fun. reject
        )///// validateIs.then()

        return deferred.promise;
    },

    saveApplication: function(appId, appObj){
        var deferred = q.defer();

        // var newApplication = new applicationModel(appObj);

        validateIds(appObj.userId, appObj.variantId)
        .then(
            function(isValid){
                if(true === isValid){
                    applicationModel.findOne({_id: appId}).exec()
                    .then(
                        function(foundedApp){
                            /**
                             * App is in Db do the save
                             */


                                /**
                                 * Loop through sent properties and set them
                                 */
                                for(prop in appObj){
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
                        },/// fun. reolve
                        function(err){
                            /**
                             * Error in finding application
                             */
                            deferred.reject(err);
                        }
                    )//// find.then()
                }/// it isValid
                else{
                     deferred.reject("User ID or variant ID is not valid");
                }/// i isValid else
            },//// fun. reslove
            function(err){
                 deferred.reject(err);
            }//// fun. reject
        )///// validateIs.then()

        return deferred.promise;
    }
}/// users object

module.exports = applicationService;