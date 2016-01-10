var businessModel = require('../models/business.model');

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
    getAll : function(reqQuery){
        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')
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
    getByIdOrSlug: function(idOrSlug, reqQuery){
        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')
        if(undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }


        // Choose between filtering on id or field depending on whether the value has a number in it
        // /\d/.test(value) is a regex test
        // This will work for now so long as slugs never have a number in them
        if(/\d/.test(idOrSlug)) {
            return businessModel.findById(idOrSlug, returnFields).exec();
        } else {
            return businessModel.findOne({ slug: idOrSlug }, returnFields).exec();
        }
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