/**
 * Created by Iyad Bitar
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .factory('AvailabilityService', ['$q', 'HirelyApiService', AvailabilityService]);

  function AvailabilityService( $q, HirelyApiService) {

    /**
     * [ref Firbase referance object]
     * @type {firebase object}
     */
    // var ref = new Firebase(FIREBASE_URL + '/users');

    /**
     * days is array of days short names
     * @type {Array}
     */
    var days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    /**
     * hours is array of hours names like 12AM, 1AM, ... with array index
     * @type {Array}
     */
    var hours = [];
    for(var h=0; h<24; h++){
      var hourLabel = '';
      var dayHalf = 'am';
      var dayHalfShort = 'a'
      var hourName = h;
      if(0==h){
          hourLabel += '12AM';
          hourName = 12;
      }
      else if(h<12){
          hourLabel += String(h) + 'AM';
      }
      else{
          hourName = h-12 <= 0 ? 12 : h-12;
          hourLabel += String(hourName) + 'PM';
          dayHalf ='pm';
          dayHalfShort = 'p';
      }

      hours.push({'hour':h, 'label':hourLabel, dayHalf:dayHalf, dayHalfShort:dayHalfShort, hourName:hourName});
    }//// for

    /**
     * [startOptions array to fill the dropdown in 'how soon can you start' question]
     * @type {Array}
     */
    var startOptions = [
      {days:0, label:'Immediately'},
      {days:7, label:'Within a week'},
      {days:14, label:'Within two weeks'},
      {days:21, label:'More than two weeks'},
    ];

    var seasonOptions = ['Winter', 'Spring', 'Summer', 'Fall'];

    /**
     * Time Ranges
     * @type {Object}
     */
    var ranges = {};

    for(var d in days){
      ranges[days[d]] = {};
    }

    /**
     * [updateRanges used to extract the time availibility ranges for each day our of weeklyTimeTable array]
     * @param  {[type]} hours [weeklyTimeTable array]
     * @return {[type]}       [Object with days property shortname
     *                                each day property is an array of ranges object
     *                                each range is an object]
     */
    var updateRanges = function(hours){
      var newRanges = {};
      angular.extend(newRanges, ranges);

      for(var key in newRanges){
        newRanges[key] = [];
        var isNewRange = false;
        var obj = {};
        for(var i=0; i<24; i++){
            if(true === hours[i].days[key] ){
              if(!isNewRange){
                isNewRange = true; /// starting a new hourly range
                obj.startLabel = hours[i].label;
                obj.startHour = i;
              }
            }//if
            else{
              if(isNewRange){
                isNewRange = false;
                obj.endLabel = hours[i].label;
                obj.endHour = i;
                obj.hours = obj.endHour - obj.startHour;
                newRanges[key].push( angular.extend({},obj) );
                obj = {};

              }
            }/// else
        }/// for i=0

        //// if end of loop reached without end add one
        // console.log(isNewRange, i);
        if(isNewRange && angular.isUndefined(obj.end)){
          isNewRange = false;
          obj.endLabel = '12AM';
          obj.endHour = 0;
          obj.hours = 24 - obj.startHour;
          newRanges[key].push( angular.extend({},obj) );
          obj = {};
        }

      }//// for key in

      angular.extend(ranges, newRanges);

      return ranges;
    }/// fun. updateRanges

    var getTotalHours = function(hours){
      var ret = {};
      ret.total = 0;

      for(var i=0; i<24; i++){
        for(var d=0; d<7; d++){
          if(true === hours[i].days[days[d]]){
            ++ret.total;
          }
        }//// d<7
      }//// for i<24

      return ret;
    }//// fun. getTotalHours

    var getDayHours = function(dayArray){

      var ret = 0;

      for(var i=0; i<24; i++){
          if(true === dayArray[i].active){
            ++ret;
          }
      }//// for i<24

      return ret;
    }//// fun. getTotalHours

    /**
     * [service object that define angular service to be returned by factory function at the end of this code]
     * @type {Object}
     */
    var service = {
      save:save,
      isAvailabilityExists: isAvailabilityExists,
      days:days,
      hours:hours,
      startOptions:startOptions,
      seasonOptions: seasonOptions,
      getTotalHours:getTotalHours,
      getDayHours:getDayHours,
      updateRanges:updateRanges,
      getWeeklyAggregatedArray:getWeeklyAggregatedArray,
      toFrontEndModel: toFrontEndModel
    };

    /**
     * [save save a new availability object]
     * @param  {[array of objects]} availability [avalability array of 24 item each is an object of 7 days to represent the applicant weakelly availability]
     * @param  {[string]} userId       [user ID to associate the availability with]
     * @return {[promise]}              [description]
     */
    function save(availability, userId){
      var data = toDBDataModel(availability);

      return HirelyApiService.users(userId).patch({availability:data})
      .then(
        function(user){
          return user;
        },
        function(err){
          console.log('error saving availablity');
          console.log(err);
        }
      );
    }//// fun. save

    /**
     * [isAvailabilityExists will check if availability object exists for a user in DB
     * if exits the promise will reslove with the availability]
     * @param  {String}  userID [description]
     * @return {Promise}        [usual promise object]
     */
    function isAvailabilityExists(userId){
        var deferred = $q.defer();

        HirelyApiService.users(userId, ['availability']).get()
        .then(
          function(avail){
            if(angular.isDefined(avail.availability)){
              deferred.resolve( toFrontEndModel(avail.availability) );
            }
            else{
              deferred.reject('Error in getting availability');
            }
          },
          function(err){
            console.log('error in getting availability');
          }
        )

        return deferred.promise;
    }

    /**
     * [toDBDataModel will take an array of of front-end availability and return an object ready to be saved in DB]
     * @param  {[front-end availablity object]} avail [fornt-end user different object format to display availability table ]
     * @return {[DB availabilty object]}       [availability is saved in different format in database]
     */
    function toDBDataModel(obj){
      var ret = angular.copy(obj);

      //// copy the time table to a local object and work on it and delete it
      var avail = ret.weeklyTimetable;
      delete ret.weeklyTimetable;

      //// translate seekerStatus
      // console.log(obj.seekerStatus);
      ret.startAvailability =  parseInt(ret.startAvailability, 10);

      for(var d=0; d<7; d++){
        var day = avail[days[d]];
        ret[days[d]] = [];
        for(var h=0; h<24; h++){
          if(true === day[h].active) ret[days[d]].push(h);
        }
      }

      return ret;
    }//// fun. forntEndToDB

    function toDBDataModelOldWireframe(obj){
      var ret = angular.copy(obj);

      //// copy the time table to a local object and work on it and delete it
      var avail = ret.weeklyTimetable;
      delete ret.weeklyTimetable;

      //// translate seekerStatus
      // console.log(obj.seekerStatus);
      ret.seekerStatus =  obj.seekerStatus ?  1 : 0;

      for(var i=0; i<24; i++){
        var days = avail[i].days

        for(var day in days){

          if(!angular.isArray(ret[day])){
            ret[day] = [];
          }
          if(true === days[day]) ret[day].push(i);
        } /// for day in days
      }//for i

      return ret;
    }//// fun. forntEndToDB

    /**
     * [toFrontEndModel will take availability from db and confert it to fornt-end availability]
     * @param  {[db availbility object]} avail [description]
     * @return {[fornt-end availablity object]}       [description]
     */
    function toFrontEndModel(dbObj){
      var retObj = angular.extend({}, dbObj);

      if(angular.isDefined(retObj.startAvailability)){
        retObj.startAvailability = String(retObj.startAvailability);
      }
      // console.log(dbObj);

      //// translate weeklyTimetable
      var ret = {};
      for(var d=0; d<7; d++){
        ret[days[d]] = [];
        var myDay = '|'+ dbObj[days[d]].join('|') + '|';
        for(var h=0; h<24; h++){
          var _h = angular.extend({}, hours[h]);
          _h.active = myDay.indexOf('|'+h+'|') > -1;
          ret[days[d]].push(_h)
        }//// for h
      }//// for d

      retObj.weeklyTimetable = ret;


      for(d=0; d<7; d++){
        delete retObj[days[d]];
      }
      return retObj;
    }//// fun. toFrondEndModel

    function toFrontEndModelWireframe(dbObj){
      var retObj = angular.extend({}, dbObj);

      //// translate seekerStatus
      retObj.seekerStatus = retObj.seekerStatus === 1;

      //// translate weeklyTimetable
      var ret = [];
      for(var i = 0; i<24; i++){
        var obj = {};
        obj.label = hours[i].label;
        var _days = {};
        for(var d=0; d<7; d++){
          _days[days[d]] = false;
          // console.log(days[d]);
          if(angular.isArray(dbObj[ days[d] ]) && dbObj[ days[d] ].indexOf(i) > -1){
            _days[days[d]] = true;
          }
          obj.days = _days;
        } /// for day in

        ret.push(obj);
      }//// for i

      retObj.weeklyTimetable = ret;

      for(d=0; d<7; d++){
        delete retObj[days[d]];
      }

      return retObj;
    }//// fun. toFrondEndModel

    function getWeeklyAggregatedArray(obj, groupSimilarDays){
      var label = null;
      var ret = [];
      var daysInRange = 0;

      function getRanges(hArr){
        var ranges = [];
        var rangeStart = null;
        var rangeEnd = null;

        for(var h=0; h<hArr.length; h++){

          if(rangeStart === null){
            rangeStart = hours[ hArr[h] ].label;
          }
          else {
            if(hArr[h] != hArr[h-1] + 1){
              rangeEnd = hours[ (hArr[h-1] + 1) % 24 ].label;
              // rangeStart = hours[ hArr[h] ].label
            }
          }

          /**
           * find the end of range
           */
          if(null !== rangeEnd){
            ranges.push(rangeStart + ' - ' + rangeEnd);
            rangeEnd = null;
            rangeStart = hours[ hArr[h] ].label;
          }

          /**
           * Don't forget the last range
           */
          if(h == hArr.length-1){
            rangeEnd = hours[ (hArr[h] + 1) % 24 ].label;
            ranges.push(rangeStart + ' - ' + rangeEnd);
          }

        }//// for
        return ranges;
      }//// fun. getHorusRanges

      if(true === groupSimilarDays){
        /**
         * group similar days
         */
        for(var d=0; d<7; d++){
          var dayName = days[d];
          var preDayName = d > 0 ? days[d-1] : null;
          var ranges;

          if(d > 0){
            if( obj[dayName].toString() !== obj[preDayName].toString()){
              if(daysInRange > 1){
                label += ' - ' + preDayName;
              }
              ret.push({label:label, hoursRanges: getRanges(obj[preDayName])});
              label = dayName;
              daysInRange = 1;
            }
            else{
              daysInRange++;
            }
          }//// if d >0
          else {

          }

          // /// first day
          if(null === label){
            label = dayName;
            daysInRange++;
          } //// if null === label

          /**
           * last range
           */
          if(d === 6){
            if(daysInRange > 1){
              label += ' - ' + dayName;
            }
            ret.push({label:label, hoursRanges: getRanges(obj[dayName])});
          }//// if d === 6
        }//// for d
      }//// if groupSimilarDays
      else{
        /**
         * don't group similar days
         */
         for(var d=0; d<7; d++){
          var dayName = days[d];
          ret.push({label:dayName, hoursRanges: getRanges(obj[dayName])});
        }//// for d<7
      }//// if else groupSimilarDays


      return ret;
    }//// fun. getWeeklyAgregatedArray

    /**
     * Return server object
     * this way we can have private functions that we don't want to expose
     */
    return service;
  }
})();
