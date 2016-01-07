var userModel = require('../models/user.model');
var idMapModel = require('../models/useridmap.model');

/**
 * [extendedFields array to define the names of extended fields in user objects]
 * @type {Array}
 */
var extendedFields = [
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
     * [getBasicInfoById function will get the basic user fields execluding the extend fields]
     * @param  {[type]} userId [user id should match user object id in DB]
     * @return {[type]}        [promise]
     */
    getBasicInfoById : function(userId){
        return userModel.findById(userId, '-' + extendedFields.join(' -')).exec();
    },

    /**
     * [getExtendedInfoById will get the extend user fields ONLY execluding the basic fields]
     * @param  {[type]} userId [user id should match user object id in DB]
     * @return {[type]}        [promise]
     */
    getExtendedInfoById : function(userId){
        return userModel.findById(userId, '_id ' + extendedFields.join(' ')).exec();
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
                    return idMap.save()
                    .then(
                        function(map){
                            return userModel.findById(map.localId, '-' + extendedFields.join(' -')).exec();
                        }
                    );//// then
                }
                else{
                    return userModel.findById(user._id, '-' + extendedFields.join(' -')).exec();
                }
            }//// then fun.
        );/// then
    },

    /**
     * [getUserByExternalId will take an external ID e.g. firebaseid and return the user basic info only]
     * @param  {[string]} extId [esternal id ]
     * @return {[promis]}       [description]
     */
    getUserByExternalId: function(extId){

        return idMapModel.findOne({externalId:extId}).exec()
        .then(
            function(map){
                return userModel.findById(map.localId, '-' + extendedFields.join(' -')).exec();
            }
        )//// then

    }


}/// users object

module.exports = userService;