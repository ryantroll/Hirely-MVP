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
            if(null !== user){
                /**
                 * User existes check if variant is there with it's business object
                 */
                businessService.getByVariantId(variantId)
                .then(
                    function(business){
                        /**
                         * Variant ID exists is list of returned business more than 0
                         */
                        if(null !== business && business.length > 0){
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

                    }//// getByVariantIid().then()
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

    /**
     * [createNewApplication will insert a new application after it make sure user id and variant id are valid by checking existance in database]
     * @param  {object} appObj [object that hold the properties of new applictaion to be insterted]
     * @return {promise}        [description]
     */
    createNewApplication: function(appObj){
        var deferred = q.defer();

        var newApplication = new applicationModel(appObj);

        /**
         * start with making sure ids of user and variants are exists in DB
         */
        validateIds(newApplication.userId, newApplication.variantId)
        .then(
            function(isValid){
                if(true === isValid){
                    /**
                     * IDs of user and variant are valid go ahead and save
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
                     deferred.reject("User ID or variant ID is not valid");
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

        validateIds(appObj.userId, appObj.variantId)
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
                    deferred.reject("User ID or variant ID is not valid");
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