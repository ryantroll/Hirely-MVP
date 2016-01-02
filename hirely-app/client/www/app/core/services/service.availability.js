/**
 * Created by Iyad Bitar
 *
 * Traitify Personality Analysis - more info: https://developer.traitify.com
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .factory('AvailabilityService', ['$q', 'FIREBASE_URL', AvailabilityService]);

  function AvailabilityService( $q, FIREBASE_URL) {

    /**
     * [ref Firbase referance object]
     * @type {firebase object}
     */
    var ref = new Firebase(FIREBASE_URL + '/users');

    /**
     * days is array of days short names
     * @type {Array}
     */
    var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    /**
     * hours is array of hours names like 12AM, 1AM, ... with array index
     * @type {Array}
     */
    var hours = [];
    for(var h=0; h<24; h++){
      var hourLabel = '';
      if(0==h){
          hourLabel += '12AM';
      }
      else if(h<12){
          hourLabel += String(h) + 'AM';
      }
      else{
          hourLabel += String(h-12 <= 0 ? 12 : h-12) + 'PM';
      }

      hours.push({'hour':h, 'label':hourLabel});
    }//// for

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

    /**
     * [service object that define angular service to be returned by factory function at the end of this code]
     * @type {Object}
     */
    var service = {
      save:save,
      isAvailabilityExists: isAvailabilityExists,
      days:days,
      hours:hours,
      getTotalHours:getTotalHours,
      updateRanges:updateRanges
    };

    /**
     * [save save a new availability object]
     * @param  {[array of objects]} availability [avalability array of 24 item each is an object of 7 days to represent the applicant weakelly availability]
     * @param  {[string]} userId       [user ID to associate the availability with]
     * @return {[promise]}              [description]
     */
    function save(availability, userId){
      var deferred = $q.defer();
      var data = toDBDataModel(availability);

      ref.child(userId).child('availability').set(data, function(error){
        if(error){
          deferred.reject(error);
        }
        else{
          deferred.resolve(true);
        }
      });

      return deferred.promise;
    }//// fun. save

    /**
     * [isAvailabilityExists will check if availability object exists for a user in DB
     * if exits the promise will reslove with the availability]
     * @param  {String}  userID [description]
     * @return {Promise}        [usual promise object]
     */
    function isAvailabilityExists(userID){
        var deferred = $q.defer();
        ref.child(userID).child('availability').once('value', function(snap){
            var exists = snap.val();
            if(null !== exists){
              var ret = toFrontEndModel(exists);
              deferred.resolve(angular.copy(ret));
            }
            else{
              deferred.reject(false);
            }
        })

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
      ret.seekerStatus = true === ret.seekerStatus ? 'active' : 'inactive';

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

      //// translate seekerStatus
      retObj.seekerStatus = retObj.seekerStatus === 'active';

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

    /**
     * Return server object
     * this way we can have private functions that we don't want to expose
     */
    return service;
  }
})();
