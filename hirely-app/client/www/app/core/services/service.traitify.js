/**
 * Created by Zouhir Chahoud
 *
 * Traitify Personality Analysis - more info: https://developer.traitify.com
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .factory('TraitifyService', ['$http', '$q', 'HirelyApiService', 'FIREBASE_URL', TraitifyService]);

  function TraitifyService($http, $q, HirelyApiService, FIREBASE_URL) {

    var traitifyRef = new Firebase(FIREBASE_URL + '/personality');

    function getAssessmentId(){
      return HirelyApiService.traitify('assessment-id').get();
    }

    function saveAssessment(results, userId, assessmentId){
        var data = {
          personalityExams:[{
            extId: assessmentId,
            slides: results.slides,
            personalityTypes: results.types,
            personalityTraits: results.traits,
            personalityBlend: results.blend
          }]
        }
        console.log(data);
        return HirelyApiService.users(userId).patch(data);
        // traitifyRef.child(userId).push(data);
    }

    return {
      getAssessmentId: getAssessmentId,
      saveAssessment:saveAssessment
    }

  }
})();
