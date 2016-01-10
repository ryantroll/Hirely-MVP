var userModel = require('../models/user.model');
var idMapModel = require('../models/useridmap.model');

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
    getAll : function(){
        return userModel.find().exec();
    },

    /**
     * [get function will get a user by id or slug]
     * @param  {[type]} id [user id should match user object id in DB]
     * @param  {[type]} reqQuery [req.query from service. if reqQuery.complete: return complete object]
     * @return {[type]}        [promise]
     */
    getById: function(id, reqQuery){
        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')
        if(undefined !== reqQuery.complete) {
            returnFields = '-nothing'
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

    }


}/// users object

module.exports = userService;