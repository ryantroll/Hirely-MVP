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

    var ref = new Firebase(FIREBASE_URL + '/availability');
    var service = {
      save:save
    };

    return service;

    function save(userId, availability){
        var data = {
          created_at: Firebase.ServerValue.TIMESTAMP,
          availability:availability
        }

        ref.child(userId).push(data);
    }

    return service;
  }
})();
