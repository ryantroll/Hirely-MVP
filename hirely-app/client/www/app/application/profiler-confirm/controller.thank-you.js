/**
 *
 * Job Profiler Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('ThankYouProfilerController', ['$rootScope', '$scope', '$stateParams', 'BusinessService', ThankYouProfilerController]);


  function ThankYouProfilerController($rootScope, $scope, $stateParams, BusinessService) {
    
    $scope.rootScopt = $rootScope;

    BusinessService.getBySlug($stateParams.businessSlug)
        .then(
            function (business) {
              $scope.business = business;
              $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);
              $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business);
            },
            function (err) {
              console.log(err)
            }
        );

  }
})();
