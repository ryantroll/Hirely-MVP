(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .factory('PositionFiltersService', ['$q', '$http', 'JobApplicationService', PositionFiltersService]);

  function PositionFiltersService($q, $http, JobApplicationService) {



    var filters = {
      applied: {
        name: "Applied",
        // dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "application.status"
            },
            {
                type: "number",
                value: 1
            }
        ]
      },
      contacted:{
        name: "Contacted",
        // dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "application.status"
            },
            {
                type: "number",
                value: 2
            }
        ]
      },
      hired: {
        name: "Hired",
        // dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "application.status"
            },
            {
                type: "number",
                value: 3
            }
        ]
      },
      declined: {
        name: "Declined",
        // dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "application.status"
            },
            {
                type: "number",
                value: 0
            }
        ]
      },
      greatFit: {
        name: "Great Fit",
        // dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: ">=",
        operands: [
            {
                type: "attr",
                value: "careerMatchScore.overall"
            },
            {
                type: "number",
                value: 90
            }
        ]
      },
      weekdays: {
        name: "Weekdays",
        // dateCreated: new Date(),
        type: "computation",
        importance: 1,
        note: "filter by having > 10 hours of weekday work",
        operator: ">",
        operands: [
            {
                type: "computation",
                operator: "+",
                operands: [
                    {
                        type: "computation",
                        operator: ".length",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.mon"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: ".length",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.tue"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: ".length",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.wed"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: ".length",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.thu"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: ".length",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.fri"
                            }

                        ]
                    }
                ]
            },
            {
                type: "number",
                value: 10
            }
        ]
      },
      weekends: {
        name: "Weekend",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        note: "filter by having > 10 hours of weekend day work",
        operator: ">",
        operands: [
            {
                type: "computation",
                operator: "+",
                operands: [
                    {
                        type: "computation",
                        operator: ".length",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.sat"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: ".length",
                        operands: [
                            {
                                type: "attr",
                                value: "user.availability.sun"
                            }

                        ]
                    }
                ]
            },
            {
                type: "number",
                value: 10
            }
        ]
      },
      mornings: {
        name: "Mornings",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        note: "filter by having > 10 hours of morning work 0 to 10",
        operator: ">",
        operands: [
            {
                type: "computation",
                operator: "+",
                operands: [
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.sun, 0, 10)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.mon, 0, 10)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.tue, 0, 10)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.wed, 0, 10)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.thu, 0, 10)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.fri, 0, 10)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.sat, 0, 10)"
                            }

                        ]
                    }
                ]
            },
            {
                type: "number",
                value: 10
            }
        ]
      },
      days : {
        name:"Days",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        note: "filter by having > 10 hours of work between 10 and 18",
        operator: ">",
        operands: [
            {
                type: "computation",
                operator: "+",
                operands: [
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.sun, 10, 18)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.mon, 10, 18)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.tue, 10, 18)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.wed, 10, 18)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.thu, 10, 18)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.fri, 10, 18)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.sat, 10, 18)"
                            }

                        ]
                    }
                ]
            },
            {
                type: "number",
                value: 10
            }
        ]
      },
      nights : {
        name:"Nights",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        note: "filter by having > 10 hours of night work between 14 and 24",
        operator: ">",
        operands: [
            {
                type: "computation",
                operator: "+",
                operands: [
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.sun, 14, 23)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.mon, 14, 23)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.tue, 14, 23)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.wed, 14, 23)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.thu, 14, 23)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.fri, 14, 23)"
                            }

                        ]
                    },
                    {
                        type: "computation",
                        operator: "",
                        operands: [
                            {
                                type: "attr",
                                value: "countHoursBetween(user.availability.sat, 14, 23)"
                            }

                        ]
                    }
                ]
            },
            {
                type: "number",
                value: 10
            }
        ]
      },
      winter: {
        name: "Winter",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "user.availability.season"
            },
            {
                type: "string",
                value: "winter"
            }
        ]
      },
      spring: {
        name: "Spring",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "user.availability.season"
            },
            {
                type: "string",
                value: "spring"
            }
        ]
      },
      summer: {
        name: "Summer",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "user.availability.season"
            },
            {
                type: "string",
                value: "summer"
            }
        ]
      },
      fall: {
        name: "Fall",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "user.availability.season"
            },
            {
                type: "string",
                value: "fall"
            }
        ]
      },
      noEducaiton: {
        name: "No Education",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "==",
        operands: [
            {
                type: "attr",
                value: "user.education.length"
            },
            {
                type: "number",
                value: 0
            }
        ]
      },
      highSchool: {
        name: "High School",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: "<=",
        operands: [
            {
                type: "attr",
                value: "maxEducation(user.education)"
            },
            {
                type: "number",
                value: 0
            }
        ]
      },
      college: {
        name: "Collage",
        dateCreated: new Date(),
        type: "computation",
        importance: 1,
        operator: ">=",
        operands: [
            {
                type: "attr",
                value: "maxEducation(user.education)"
            },
            {
                type: "number",
                value: 2
            }
        ]
      }
    }/// filters object

    function countHoursBetween(arr, start, end){
      var ret = 0;
      for(var x=start; x<=end; x++){
        ret += arr.indexOf(x) > -1 ? 1 : 0;
      }

      return ret;
    }

    function maxEducation(arr){
      var ret = 0;
      var list = JobApplicationService.educationPrograms;

      for(var x=0; x<arr.length; x++){
        var program = arr[x].programType;
        var i = list.indexOf(program);
        if( i > ret) ret = i;
      }
      console.log(program)
      return ret;
    }

    var activeFilters = [];

    function parseSingleFilter(filterName){
      var ret = '';

      if(filterName in filters){
        var fobj = filters[filterName];

        if(
          angular.isDefined(fobj.operands[0].operands)
          && Array.isArray(fobj.operands[0].operands)
        ){
          /**
           * a list of operands for this filter
           */
          var mOprands = fobj.operands[0].operands;
          var opArr = [];
          for(var x=0; x<mOprands.length; x++){

            opArr.push(mOprands[x].operands[0].value + mOprands[x].operator);
          }

          ret += opArr.join(fobj.operands[0].operator);
        }
        else{
          /**
           * single operand
           */
          ret += fobj.operands[0].value;
        }

        ret += fobj.operator;
        ret += fobj.operands[1].value;
      }
      else{
        //// if filter not exists return true
        return 'true';
      }

      return ret;
    }//// fun. buildFilter

    function test(application, user, careerMatchScore){
      var ret = true;

      var len = activeFilters.length;

      for(var x=0; x<len; x++){
        var filterStr = parseSingleFilter(activeFilters[x].name);

        var result = true;

        try{
          result = eval(filterStr);
        }
        catch(e){
          result = false;
        }

        ret = ret && result

        if(false === ret){
          break;
        }

      }////for

      return ret;
    }//// fun. test

    function getActiveFilterIndex(value, propertyName){
      var found = null;
      for(var x=0; x<activeFilters.length; x++){
        if(activeFilters[x][propertyName] === value){
          found = x;
          break;
        }
      }//// for
      return found;
    }

    /**
     * [addFilter Will add a new filter to active list]
     * @param {[type]} filterName  [name of the filter ]
     * @param {[type]} dontReplace [if set to true the new filter will be added if not true the new filter will replace old filter in list that affect same property]
     * return true in formal add false in replace
     */
    function addFilter(filterName, dontReplace){

        var prop = filters[filterName].operands[0].value;

        if(angular.isUndefined(prop)){
          prop = filters[filterName].operands[0].operands[0].operands[0].value;
        }

        if(true === dontReplace){
          activeFilters.push({name:filterName, property:prop});
          // return true;
        }
        else{
          /** Search filter by props */
          var found = getActiveFilterIndex(prop, 'property');

          if(null !== found){
            activeFilters.splice(found, 1, {name:filterName, property:prop});
            // return false;
          }
          else{
            activeFilters.push({name:filterName, property:prop});

            // return true;
          }
        }//// else

    }///// fun. filterName

    function removeFilter(filterName){

      var found = getActiveFilterIndex(filterName, 'name');

      if(null !== found ){
        activeFilters.splice(found, 1);

        // return true;
      }

    }

    function isFilterActive(filterName){
      var found = getActiveFilterIndex(filterName, 'name');
      return found !== null && found > -1;
    }



    var service = {
      filters:filters,
      test:test,
      addFilter:addFilter,
      removeFilter:removeFilter,
      isFilterActive:isFilterActive
    };

    return service;
  };
})();

