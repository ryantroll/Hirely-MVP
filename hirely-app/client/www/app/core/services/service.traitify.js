/**
 * Created by Zouhir Chahoud
 *
 * Traitify Personality Analysis - more info: https://developer.traitify.com
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .factory('TraitifyService', ['$http', '$q', 'FIREBASE_URL', TraitifyService]);

  function TraitifyService($http, $q, FIREBASE_URL) {

    var traitifyRef = new Firebase(FIREBASE_URL + '/personality');

    function getAssessmentId(){
      var deferred = $q.defer();

      $http.get('/api/traitify/assesment-id')
        .success(function (data) {
          console.log(data);
          deferred.resolve(data);
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });

      return deferred.promise;
    }

    function saveAssessment(results, userId, assessmentId){
        var data = {
          created_at: moment().format(),
          assessment_id: assessmentId,
          slides: results.slides,
          personality_types: results.types,
          personality_traits: results.traits
        }
        traitifyRef.child(userId).push(data);
    }

    return {
      getAssessmentId: getAssessmentId,
      saveAssessment:saveAssessment
    }

  }
})();
