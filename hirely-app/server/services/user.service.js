var userModel = require('../models/user.model');
var idMapModel = require('../models/useridmap.model');
var q = require('q');

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
    'preferences'
];


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
        if(undefined !== reqQuery.complete) {
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
        console.log(userObj);
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
        );/// then
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

                if(foundedUser){

                    /**
                     * Loop through sent properties and set them
                     */
                    for(prop in userData){
                        foundedUser[prop] = userData[prop];
                    }//// for

                    /**
                     * Save the new user document after setting lastModifiedOn date to now
                     */
                    foundedUser.lastModifiedOn = new Date();
                    foundedUser.save()
                    .then(
                        function(user){
                            /**
                             * User saved successfully
                             */

                            deferred.resolve(user);
                        },//// save() resolve
                        function(err){
                            /**
                             * Error in updating user
                             */
                            console.log('Error: user couldn\'t be updated');
                            deferred.reject(err);
                        }
                    )/// .save().then

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
    }//// fun. saveUser

}/// users object

module.exports = userService;