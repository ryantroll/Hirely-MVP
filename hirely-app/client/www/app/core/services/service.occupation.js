(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .service('OccupationService', ['$q', '$http', OccupationService]);

  function OccupationService($q, $http) {

    /*
    * Search occupation by search query term
    * HTTP function: GET
    * Endpoint: /api/onet/titles/search/:query
    * Return: Promise with 1 to 5 matching results
    * */
    // This function is deprecated
    this.getOccupations = function getOccupations(query) {
      var deferred = $q.defer();

      $http.get('/api/onet/titles/search/' + query)
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (data) {
          console.log('Error: ' + data);
        });

      return deferred.promise;
    };

    /*
     * Search occupation by search query term
     * HTTP function: GET
     * Endpoint: /api/v1/occupations/searchByKeyword/
     * Return: Promise with 1 to ? matching results
     * */
    this.searchOccupations = function searchOccupations(query) {
      var deferred = $q.defer();

      $http.get('/api/v1/occupations/searchByKeyword/' + query.replace(" ", "%20"))
          .success(function (data) {
            deferred.resolve(data.results);
          })
          .error(function (data) {
            console.log('Error getting occupations: ' + data);
            deferred.resolve([]);
          });

      return deferred.promise;
    }
  };
})();

