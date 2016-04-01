'use strict'
var businessModel = require('../models/business.model');
var userModel = require('../models/user.model');
var onetIconsModel = require('../models/onetIcons.model');
var applicationModel = require('../models/application.model');
var careerMatchScoresModel = require('../models/careerMatchScores.model');
/**
 * [privateFields array to define the names of extended fields in user objects]
 * @type {Array}
 */
var privateFields = [

];

var businessService = {

    getById: function(id, reqQuery){
        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')
        if(undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }

        return businessModel.findById(id, returnFields).exec();
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

    getByLocationId: function(locationId, reqQuery){

        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')

        if(undefined !== reqQuery && undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }

        return businessModel.findOne({ $where: "obj.locations['"+locationId+"']" }, returnFields).exec();
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
            case ">=":
                return left >= right;
            case "<":
                return left < right;
            case "<=":
                return left <= right;
            case "==":
                return left == right;
            case "!=":
                return left != right;
            case "indexOf":
                return left.indexOf(right);
            
            // Special within for availability
            // Checks to see if left is completely within right
            // TODO: not even using this right now, consider removing
            case "availWithin":
                left.forEach(function(element) {
                    if (right.indexOf(element) == -1) {
                        return 0;
                    }
                });
                return 1;
            
            // Normal array ops
            case "len":
                return left.length
            case "sum":
                var sum = 0;
                for (let e of left) {
                    sum += e;
                }
                return sum;
            case "avg":
                var sum = 0;
                for (let e of left) {
                    sum += e;
                }
                return sum / left.length;
            case "slice":
                var arr = left;
                if (right.start != null) {
                    arr = arr.slice(right.start);
                }
                if (right.stop !== null) {
                    arr = arr.slice(0, right.stop);
                }
                return arr;

            // A special slice for availability arrays, which slices based on value instead of index
            case "sliceAvail":
                var avail = [];
                for (let hour of avail) {
                    if (right.start != null && hour < right.start) {
                        continue;
                    }
                    if (right.stop != null && hour >= right.stop) {
                        continue;
                    }
                    avail.push(hour);
                }
                return avail;
        }
    },


    filterCompoundCalculator: function(filter, context) {
        console.log("CPBSQFE1");
        switch (filter.type) {
            case 'number':
            case 'string':
            case 'array':
                // Filter is reduced to a const
                return filter.value;
            case 'attr':
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
                if (filter.operands.length == 1) {
                    // Is an array operation, like sum or avg
                    return this.filterBasicCalculator(filter.operator, result, filter.options);
                } else {
                    for (let operand of filter.operands.slice(1)) {
                        var intermediateResult = this.filterCompoundCalculator(operand, context);
                        result = this.filterBasicCalculator(filter.operator, result, intermediateResult);
                    }
                }
        }
        console.log("CPBSQFE9");
        return result;
    },
    
    isUserIdFilteredForPositionId: function(userId, positionId, reqQuery) {
        return businessModel.findOne({ $where: "obj.positions['"+positionId+"']" }).then(function(business) {
            var businessObj = business.toObject();
            var position = businessObj.positions[positionId];
            return userModel.findById(userId).then(function(user) {
                return applicationModel.findOne({userId: user._id, positionId: positionId}).then(function(application) {
                    return careerMatchScoresModel.findOne({userId: user._id, occId: position.occId}).then(function(careerMatchScores) {
                        return businessService.isUserFilteredForPosition(user, businessObj, positionId, application, careerMatchScores);
                    });
                })
            });
        });

    },  // end isUserIdFilteredForPositionId
    
    isUserFilteredForPosition: function(user, business, positionId, application, careerMatchScores, disqualifyThreshold) {
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

        var careerMatchScoresExpLvlSpecific = careerMatchScores.scores[position.expLvl];

        var context = {
            'business': business,
            'location': location,
            'position': position,
            'user': user,
            'application': application,
            'careerMatchScore': careerMatchScores.scores[position.expLvl]
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

    }  // end isUserFiltered



}/// businesss object


module.exports = businessService;