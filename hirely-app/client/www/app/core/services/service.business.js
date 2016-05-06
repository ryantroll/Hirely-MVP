(function () {
    'use strict';

    angular.module('hirelyApp.account')
        .service('BusinessService', ['$q', 'HirelyApiService', BusinessService]);

    function BusinessService($q, HirelyApiService) {


        this.getWorkTypeTitle = function (type) {
            var types = [
                {name: 'part-time', title: 'Part Time'},
                {name: 'full-time', title: 'Full Time'},
                {name: 'seasonal', title: 'Seasonal'},
                {name: 'exempt', title: 'Exempt'}
            ];
            var ret = null;
            var limit = types.length;
            for (var x = 0; x < limit; x++) {
                if (types[x].name === type) {
                    ret = types[x].title;
                    break;
                }
            }
            return ret;
        }; //// fun. getWorkTypeTitle

        this.getBySlug = function (slug) {
            var deferred = $q.defer();
            HirelyApiService.businesses(slug).get()
                .then(
                    function (businesses) {
                        if (businesses) {
                            deferred.resolve(businesses);
                        }
                        else {
                            deferred.reject('Business not found')
                        }


                    },
                    function (err) {
                        deferred.reject(err)
                    }
                );

            return deferred.promise;
        }; //// fun. getBySlug

        /**
         * [getPositionById will return an OBJECT (not array) list of POISITIONS object NOT business by sending one position id or any array of ids
         * business and location will come as child property of each position object]
         * @param  {id or array of ids} ids [it can be one id or an array of ids to by queried ]
         * @return {promise}     [promise on success the promise will return a object of objects ]
         */
        this.getPositionsByIds = function (ids) {

            if(!(ids)) {
                return $q.resolve([]);
            }

            if (angular.isString(ids)) {
                ids = [ids];
            }

            if (!ids.length) {
                return $q.resolve([]);
            }

            var deferred = $q.defer();
            HirelyApiService.businesses('getPositionsByIds', ids.join('|')).get()
                .then(
                    function (positions) {
                        if (positions) {
                            deferred.resolve(positions);
                        }
                        else {
                            deferred.reject('Positions not found')
                        }


                    },
                    function (err) {
                        deferred.reject(err)
                    }
                );

            return deferred.promise;
        }; //// fun. getPositionById

        this.getPositionsByManagerId = function (managerId) {
            var deferred = $q.defer();

            HirelyApiService.businesses('getPositionsByManagerId', managerId).get()
                .then(
                    function (positions) {
                        deferred.resolve(positions);
                    },
                    function (err) {
                        deferred.reject(err)
                    }
                );

            return deferred.promise;
        }//// fun. getPositionByManagerId

        this.locationBySlug = function (slug, business) {

            if (angular.isUndefined(business.locationSlugs[slug])) {
                return null;
            }
            if (angular.isDefined(business.locations[business.locationSlugs[slug]])) {
                return business.locations[business.locationSlugs[slug]];
            }
            else {
                return null;
            }
        }; //// loationBySlug

        this.positionBySlug = function (posSlug, locSlug, business) {
            var loc = this.locationBySlug(locSlug, business);
            if (null === loc) {
                return null;
            }
            if (angular.isUndefined(loc.positionSlugs[posSlug])) {
                return null;
            }

            if (angular.isDefined(business.positions[loc.positionSlugs[posSlug]])) {
                return business.positions[loc.positionSlugs[posSlug]];
            }
            else {
                return null;
            }
        }; //// fun. positionBySlug


        this.getPositionsByLocation = function (business, locationId, excludeId) {
            var ret = [];

            for (var pos in business.locations[locationId].positionSlugs) {
                var posId = business.locations[locationId].positionSlugs[pos];
                if (angular.isDefined(excludeId)) {
                    if (posId !== excludeId) {
                        ret.push(business.positions[posId]);
                    }

                }
                else {
                    ret.push(business.positions[posId]);
                }

            }
            return ret;
        }

        /**
         * [getPositionDisplayData will retrieve the icon data for a list of occupations by their ids]
         * @param  {[String]} onetId [String contains the occupations IDs separated by | character]
         * @return {[Promise]}        [description]
         */
        this.getPositionDisplayData = function (onetId) {
            var deferred = $q.defer();


            HirelyApiService.businesses('positionIcon', {occId: onetId}).get()
                .then(
                    function (iconObject) {
                        deferred.resolve(iconObject);
                    },
                    function (err) {
                        deferred.reject(err)
                    }
                );

            return deferred.promise;
        }/// fun. getPositionDisplayData

        this.getPositionOccupationMetas = function (onetId) {
            var deferred = $q.defer();


            HirelyApiService.businesses('occupationMetas', {occId: onetId}).get()
                .then(
                    function (metas) {
                        deferred.resolve(metas);
                    },
                    function (err) {
                        deferred.reject(err)
                    }
                );

            return deferred.promise;
        }/// fun. getPositionOccupationMetas


        this.filterBasicCalculator = function (operator, left, right) {
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
                    left.forEach(function (element) {
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
                    left.forEach(function (element) {
                        sum += element;
                    });
                    return sum;
                case "avg":
                    var sum = 0;
                    left.forEach(function (element) {
                        sum += element;
                    });
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
                    left.forEach(function (hour) {
                        if (right.start != null && hour < right.start) {
                            return;
                        }
                        if (right.stop != null && hour >= right.stop) {
                            return;
                        }
                        avail.push(hour);
                    });
                    return avail;
            }
        };


        this.filterCompoundCalculator = function (filter, context) {
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
                    parts.forEach(function (part) {
                        result = result[part];
                    });
                    return result;
                case 'computation':
                    // Note:  An operand can be nested filter.
                    result = this.filterCompoundCalculator(filter.operands[0], context);
                    if (filter.operands.length == 1) {
                        // Is an array operation, like sum or avg
                        return this.filterBasicCalculator(filter.operator, result, filter.options);
                    } else {
                        var self = this;
                        filter.operands.slice(1).forEach(function (operand) {
                            var intermediateResult = self.filterCompoundCalculator(operand, context);
                            result = self.filterBasicCalculator(filter.operator, result, intermediateResult);
                        });
                    }
            }
            console.log("CPBSQFE9");
            return result;
        };

        this.isUserFilteredForPosition = function (user, business, positionId, application, careerMatchScores, disqualifyThreshold) {
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

        };  // end isUserFiltered


    }//// BsunessService


})();
