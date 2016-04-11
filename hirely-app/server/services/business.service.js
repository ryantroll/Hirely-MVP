'use strict'
var businessModel = require('../models/business.model');
var userModel = require('../models/user.model');
var onetIconsModel = require('../models/onetIcons.model');
var applicationModel = require('../models/application.model');
var permissionsModel = require('../models/permission.model');
var careerMatchScoresModel = require('../models/careerMatchScores.model');
var q = require('q');
/**
 * [privateFields array to define the names of extended fields in user objects]
 * @type {Array}
 */
var privateFields = [

];

var BusinessService = {

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

        var ids = positionId.split('|');

        return businessModel.findOne({ $where: "obj.positions['"+positionId+"']" }, returnFields).exec();
    },

    /**
     * [getPositionByIds will retrieve POSITION objects from business collection location and business basic fields will be added as properties for each position]
     * @param  {[type]} positionIds [Array of positions IDs if one position needed send array with one item]
     * @return {promise}             [return a promise with retrieved positions array on resolve]
     */
    getPositionsByIds: function(positionIds, reqQuery, isSuperUser){
        var deferred = q.defer();

        if (!(positionIds && positionIds.length)) {
            deferred.resolve([]);
            return deferred.promise;
        }

        // console.log("BS:getPositionsByIds:1: " + positionIds);

        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -')

        if(undefined !== reqQuery && undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }

        var ids = positionIds;

         var ret = {};

        if (isSuperUser && false) {
            query = {};
        } else {
            var query = {$or: []};
            for (var x = 0; x < ids.length; x++) {
                var or = {};
                or['positions.' + ids[0]] = {$exists: true, $nin: [null]};
                query.$or.push(or);
            }
        }



        businessModel.find(query, returnFields)
        .then(
            function(found){
                // console.log("BS:getPositionsByIds:11");
                try {
                    if (Array.isArray(found)) {
                        // console.log("BS:getPositionsByIds:12");
                        for (var i = 0; i < found.length; i++) {
                            // console.log("BS:getPositionsByIds:13");
                            var b = found[i];
                            var positions = b.positions.toObject();
                            for (var pos in positions) {
                                // console.log("BS:getPositionsByIds:14");
                                if (ids.indexOf(pos) > -1) {
                                    // console.log("BS:getPositionsByIds:15");
                                    var myPos = positions[pos];

                                    /**
                                     * add required location and business field to position
                                     */
                                    var location = b.locations.toObject()[myPos.locationId];
                                    if (!location) {
                                        var err = "BS:getPositionsByIds:15.1:error: location missing with id = " + myPos.locationId + "; Available: ["+Object.keys(b.locations.toObject()).join(',')+"]";
                                        console.log(err);
                                        continue;
                                    }

                                    // The following is commented out because it's throwing an error and doesn't seem necessary
                                    // delete location.positionSlugs;

                                    myPos.location = location;
                                    myPos.business = {name: b.name, slug: b.slug, _id: b._id, description: b.description};

                                    /**
                                     * initiate the applicationCount to 0 in preparation for next promise
                                     * @type {Number}
                                     */
                                    myPos.applicationCount = 0;

                                    ret[pos] = myPos
                                    // console.log("BS:getPositionsByIds:16");
                                }
                            }//// for pos in b

                            // console.log("BS:getPositionsByIds:17");
                            /**
                             * Get the application count where status is not dismiss
                             * @type {Object}
                             */
                            return applicationModel.aggregate([{$match:{positionId:{$in:ids}, status:{$nin:[0]}}}, {$group:{_id:'$positionId', applicationCount:{"$sum":1}}}]).exec()
                            // console.log("BS:getPositionsByIds:complete");
                        }////for i
                    }//// if isArray
                } catch(err) {
                    error = "BS:getPositionsByIds:error: "+err;
                    console.log(err);
                    deferred.reject(err);
                }
            },//// then success
            function(err){
                deferred.reject(err);
            }
        )
        .then(
            function(appCount){
                ///
                if(Array.isArray(appCount) && appCount.length > 0){
                    for(var x=0; x<appCount.length; x++){
                        /**
                         * Update the applicationCount in return object
                         */
                        if(ret[appCount[x]._id]){
                            ret[appCount[x]._id].applicationCount = appCount[x].applicationCount;
                        }
                    }
                }

                deferred.resolve(ret);

            },
            function(err){
                console.log('IB:Getting.application.count>>', err);
                deferred.resolve(ret);
            }
        )
        return deferred.promise;
    },

    /**
     * [getPositionsByManagerId query the position based on permission where user has Create, Update, and Delete authorization
     * this function depend on getPositionByIds]
     * @param  {[type]} managerId [user id of designated position manager]
     * @return {[type]}           [description]
     */
    getPositionsByManagerId: function(managerId, reqQuery, isSuperUser){

        if (isSuperUser) {
            return businessModel.find({}).then(function(businesses) {
                var positionIds = [];
                for (var b in businesses) {
                    for (var p in businesses[b].toObject().positions) {
                        positionIds.push(p);
                    }
                }
                return BusinessService.getPositionsByIds(positionIds);
            });
        }

        var deferred = q.defer();


        // console.log("BS:getPositionsByManagerId:1:managerid: "+managerId);

        // Determine what fields to return based on reqQuery.
        var returnFields = '-' + privateFields.join(' -');

        if(undefined !== reqQuery && undefined !== reqQuery.complete) {
            returnFields = '-nothing'
        }

        var ids = [];
        var query = {$or: []};
        var queryNext = {$or: []};

        /**
         * these two arrays will keep track of business ids and locations ids where manager
         * has a permission on them for next query
         * @type {Array}
         */
        var businessesIds = [];
        var locationsIds = [];

        query.$or.push({srcId:managerId, srcType:'users', destType:'businesses', c:true, u:true, d:true});
        query.$or.push({srcId:managerId, srcType:'users', destType:'locations', c:true, u:true, d:true});
        query.$or.push({srcId:managerId, srcType:'users', destType:'positions', c:true, u:true, d:true});
        console.log('>>>>>>', query);
        // console.log("BS:getPositionsByManagerId:2");
        permissionsModel.find(query)
        .then(
            function(found){
                // console.log("BS:getPositionsByManagerId:3");

                if (found.length) {
                    console.log("BS:getPositionsByManagerId:3.1");

                    /**
                     * add the position id to the list or position
                     * or if business or location add new criteria for next query
                     */
                    for (var i = 0; i < found.length; i++) {
                        // console.log("BS:getPositionsByManagerId:4");
                        switch (found[i].destType) {
                            case 'positions':
                                // console.log("BS:getPositionsByManagerId:5: "+found[i].destId);
                                ids.push(found[i].destId);
                                break;
                            case 'businesses':
                                // console.log("BS:getPositionsByManagerId:6: "+found[i].destId);
                                queryNext.$or.push({_id: found[i].destId});
                                businessesIds.push(found[i].destId);
                                break;
                            case 'locations':
                                // console.log("BS:getPositionsByManagerId:6.5: "+found[i].destId);
                                var q = {};
                                q['locations.' + found[i].destId] = {$exists: true};
                                locationsIds.push(found[i].destId);
                                queryNext.$or.push(q);
                                break;
                        }
                    }

                    // console.log("BS:getPositionsByManagerId:7");
                    return businessModel.find(queryNext);
                    // Both of these work too
                    // return businessModel.find({$or: queryNext.$or});
                    // return businessModel.find().or(queryNext.$or);
                } else {
                    return [];
                }
            },
            function(err){
                console.log(err)
            }
        )
        .then(
            function(businesses){
                // console.log("BS:getPositionsByManagerId:8:businessIds: "+businessesIds);

                if (businesses.length) {

                    for (var i = 0; i < businesses.length; i++) {
                        // console.log("BS:getPositionsByManagerId:9:businessId: "+businesses[i]._id);
                        //// if manager has permission on business then add all of its positions
                        var addAllLocations = businessesIds.indexOf(String(businesses[i]._id)) >= 0;

                        // console.log("BS:getPositionsByManagerId:10:addAllLocations " + addAllLocations);
                        var positions = businesses[i].positions.toObject();
                        // console.log("BS:getPositionsByManagerId:11");
                        for (var pos in positions) {
                            // console.log("BS:getPositionsByManagerId:12");

                            if (true === addAllLocations || locationsIds.indexOf(positions[pos].locationId) >= 0) {
                                // console.log("BS:getPositionsByManagerId:13");
                                if (ids.indexOf(pos) < 0) ids.push(pos);
                            }

                        }//// for pos in positions
                    }//// for
                    // console.log("BS:getPositionsByManagerId:20");
                    return BusinessService.getPositionsByIds(ids);
                } else {
                    return [];
                }
            },
            function(err){
                err = "BS:getPositionsByManagerId:21:error" + err;
                console.log(err);
                deferred.reject(err);
            }
        )
        .then(
            function(positions){
                // console.log("BS:getPositionsByManagerId:30");
                deferred.resolve(positions);
            },
            function(err){
                err = "BS:getPositionsByManagerId:40:error" + err;
                console.log(err);
                deferred.reject(err);
            }
        );
        // console.log("BS:getPositionsByManagerId:50");
        return deferred.promise;
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
                        return BusinessService.isUserFilteredForPosition(user, businessObj, positionId, application, careerMatchScores);
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


module.exports = BusinessService;