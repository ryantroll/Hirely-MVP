/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$state', '$stateParams', 'GeocodeService', HomeCtrl ]);

  function HomeCtrl ($scope, $state, $stateParams, GeocodeService) {
      var geocodeService = GeocodeService;

      $scope.results = '';
      $scope.options = {
          types: '(regions)'
      };

      $scope.details = '';


      $scope.getResults = function() {
          geocodeService.setPlace($scope.details);
            $state.go('app.job')

      }

  }
 })();
