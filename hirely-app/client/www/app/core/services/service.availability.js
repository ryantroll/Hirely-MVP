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
    var ref = new Firebase(FIREBASE_URL + '/availability');

    /**
     * [service object that define angular service to be returned by factory function at the end of this code]
     * @type {Object}
     */
    var service = {
      save:save,
      isAvailabilityExists: isAvailabilityExists
    };

    /**
     * [save save a new availability object]
     * @param  {[array of objects]} availability [avalability array of 24 item each is an object of 7 days to represent the applicant weakelly availability]
     * @param  {[string]} userId       [user ID to associate the availability with]
     * @return {[promise]}              [description]
     */
    function save(availability, userId){
      var deferred = $q.defer();
      var data = {
        createdOn: Firebase.ServerValue.TIMESTAMP,
        weeklyTimetable:availability
      }

      ref.child(userId).set(data, function(error){
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

        ref.child(userID).once('value', function(snap){
            var exists = snap.val();
            if(null !== exists){
                deferred.resolve(exists);
            }
            else{
                deferred.reject(false);
            }
        })

        return deferred.promise;
    }

    /**
     * Return server object
     * this way we can have private functions that we don't want to expose
     */
    return service;
  }
})();
