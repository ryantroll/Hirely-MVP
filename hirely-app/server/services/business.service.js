'use strict'
var businessModel = require('../models/business.model');
var userModel = require('../models/user.model');
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
    },


    filterBasicCalculator: function(operator, left, right) {
        switch (operator) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "/":
                return left / right;
            case "*":
                return left * right;
            case "%":
                return left % right;
            case "^":
                return Math.pow(left, right);
            case ">":
                return left > right;
            case "<":
                return left < right;
            case "within":
                left.forEach(function(element) {
                    if (right.indexOf(element) == -1) {
                        return 0;
                    }
                });
                return 1;
        }
    },


    filterCompoundCalculator: function(filter, context) {
        console.log("CPBSQFE1");
        switch (filter.type) {
            case 'number':
            case 'string':
                // Filter is reduced to a const
                return filter.value;
            case 'attribute':
                // Filter is reduced to a const
                // const = attribute of a variable, resolve attribute
                var parts = filter.value.split('.');
                var result = context[parts.shift()];
                for (let part of parts) {
                    result = result[part];
                }
                return result;
            case 'computation':
                // Note:  An operand can be nested filter.
                result = this.filterCompoundCalculator(filter.operands[0], context);
                for (let operand of filter.operands.slice(1)) {
                    var intermediateResult = this.filterCompoundCalculator(operand, context);
                    result = this.filterBasicCalculator(filter.operator, result, intermediateResult);
                }
        }
        console.log("CPBSQFE9");
        return result;
    },

    // This is not currently being used, but may be used in the future
    // getQualificationScore: function(user, business, position) {
    //
    //     var location = business.locations[position.locationId];
    //     var fScoreSum = 0;
    //     var fScoreMaxSum = 0;
    //
    //     position.filters.forEach(function(filter) {
    //         var fScore = MatchService.filterCompoundCalculator(filter, business, location, position, user);
    //         if (fScore > 0) {
    //             fScore = 1;
    //         }
    //
    //         fScoreMaxSum += filter.importance;
    //         fScoreSum += fScore * filter.importance;
    //     });
    //
    //     if (fScoreMaxSum == 0) {
    //         return 1;
    //     } else {
    //         return fScoreSum / fScoreMaxSum;
    //     }
    //
    // },  // end getQualificationScore

    // TODO:  Move this to frontend when ready
    isUserIdFilteredForPositionId: function(userId, positionId, reqQuery) {
        return businessModel.findOne({ $where: "obj.positions['"+positionId+"']" }).then(function(business) {
            return userModel.findById(userId).then(function(user) {
                return businessService.isUserFilteredForPosition(user, business.toObject(), positionId);
            });
        });

    },  // end isUserIdFilteredForPositionId

    // TODO:  Move this to frontend when ready
    isUserFilteredForPosition: function(user, business, positionId, disqualifyThreshold) {
        disqualifyThreshold = disqualifyThreshold || 0;  // 0 is least important

        console.log("CPBSUF1");
        var position = business.positions[positionId];
        var location = business.locations[position.locationId];

        if (position.filters == null) {
            console.log("null filters");
            return true
        }
        if (position.filters == undefined) {
            console.log("undef filters");
            return true
        }
        if (position.filters.length == 0) {
            console.log("0 filters");
            return true
        }

        var context = {
            'business': business,
            'location': location,
            'position': position,
            'user': user
        };

        console.log("CPBSUF2");
        for (var filterId in position.filters) {
            console.log("CPBSUF3");
            var isFiltered = this.filterCompoundCalculator(position.filters[filterId], context);

            console.log("CPBSUF4");
            if (isFiltered == true && position.filters[filterId].importance >= disqualifyThreshold) {
                console.log("CPBSUF5");
                return true;
            }
        }

        console.log("CPBSUF10");
        return false;

    },  // end isUserFiltered



}/// businesss object


module.exports = businessService;