var businessModel = require('../models/business.model');

/**
 * [extendedFields array to define the names of extended fields in user objects]
 * @type {Array}
 */
var extendedFields = [
    'locations'
];

/**
 * [privateFields array to define the names of extended fields in user objects]
 * @type {Array}
 */
var privateFields = [
    'locations.positions.variants.applications'
];

var businessService = {
    /**
     * [getAll function will get all businesss.  Not to be used in production]
     * @return {[type]}        [promise]
     */
    getAll : function(){
        return businessModel.find().exec();
    },

    /**
     * [getPublicInfoById function will get the basic business fields execluding the extend fields]
     * @param  {[type]} businessId [business id should match business object id in DB]
     * @return {[type]}        [promise]
     */
    getBasicInfoById : function(businessId){
        return businessModel.findById(businessId, '-' + extendedFields.join(' -')).exec();
    },

    /**
     * [getPublicInfoById function will get the public]
     * @param  {[type]} businessId [business id should match business object id in DB]
     * @return {[type]}        [promise]
     */
    getPublicInfoById : function(businessId){
        return businessModel.findById(businessId, '-' + privateFields.join(' -')).exec();
    },

    /**
     * [getAllInfoById will get the all business fields]
     * @param  {[type]} businessId [business id should match business object id in DB]
     * @return {[type]}        [promise]
     */
    getAllInfoById : function(businessId){
        return businessModel.findById(businessId).exec();
    },

    /**
     * [createNewBusiness will create new business object in database]
     * @param  {[type]} businessObj [JS object with required field in business Model]
     * @return {[type]}         [promise with business basic info]
     */
    createNewBusiness : function(businessObj){
        var newBusiness = new businessModel(businessObj);

        return newBusiness.save()
        .then(
            function(business){
                return businessModel.findById(business._id).exec();
            }//// then fun.
        );/// then
    }

}/// businesss object

module.exports = businessService;