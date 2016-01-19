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
          slides: results.slides,
          personalityTypes: results.types,
          personalityTraits: results.traits,
          personalityBlend: results.blend
        }

        return HirelyApiService.traitify({userId:userId, assessmentId:assessmentId}).post(data);
    }

    /**
     * [getTest will return a test exam object from local server to avoid anwering the 56 slide of traitify]
     * @return {promise} [description]
     */
    function getTest(){
      return HirelyApiService.traitify('test').get();
    }

    function getUserAssessment(userId){
      return HirelyApiService.traitify({userId:userId}).get();
    }

    return {
      getAssessmentId: getAssessmentId,
      saveAssessment:saveAssessment,
      getTest: getTest,
      getUserAssessment: getUserAssessment
    }

  }
})();
