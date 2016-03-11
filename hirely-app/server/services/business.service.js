var businessModel = require('../models/business.model');
var onetIconsModel = require('../models/onetIcons.model');
/**
 * [privateFields array to define the names of extended fields in user objects]
 * @type {Array}
 */
var privateFields = [

];

var businessService = {
    /**
     * [getAll function will get all businesss.  Not to be used in production]
     * @return {[type]}        [promise]
     */
    getAll : function(reqQuery){
        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -');
        if(undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }
        return businessModel.find({}, returnFields).exec();
    },

    /**
     * [get function will get a business by id or slug]
     * @param  {[type]} idOrSlug [business id/slug should match business object id/slug in DB]
     * @param  {[type]} reqQuery [req.query from service. if reqQuery.complete: return complete object]
     * @return {[type]}        [promise]
     */
    getBySlug: function(slug, reqQuery){
        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')
        if(undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }

        return businessModel.findOne({ slug: slug }, returnFields).exec();
    },

    /**
     * [getByPositionId will return a busniess object based on position ID that in positions array]
     * @param  {string} positionId [id of position tha belong to requested business object ]
     * @return {promise}           [description]
     */
    getByPositionId: function(positionId, reqQuery){

        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')

        if(undefined !== reqQuery && undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }

        return businessModel.findOne({ $where: "obj.positions['"+positionId+"']" }, returnFields).exec();
        //return businessModel.find({})
        //.where({positions:{$elemMatch:{_id:positionId}}})
        //.exec();
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
    },

    /**
     * [getPositionDisplayData will get a list of onetIcon object based on occupation ids]
     * @param  {[String]} onetId [String with occupation IDs separated by | characters]
     * @return {[Promise]}        [description]
     */
    getPositionDisplayData : function(onetId){
        /**
         * Make an array from string by splitting it
         * @type {[type]}
         */
        var arr = onetId.split('|');
        /**
         * Find will return ARRAY of objects
         */
        return onetIconsModel.find({occId:{$in:arr}}).exec();
    }



}/// businesss object


module.exports = businessService;