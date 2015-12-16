/**
 * Created by Zouhir Chahoud
 *
 * Traitify Personality Analysis - more info: https://developer.traitify.com
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .factory('TraitifyService', ['$http', '$q', TraitifyService]);

  function TraitifyService($http, $q) {

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

    return {
      getAssessmentId: getAssessmentId
    }

  }
})();