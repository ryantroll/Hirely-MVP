/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('ThankYouApplicationController', ['$rootScope', '$scope', '$stateParams', 'BusinessService', ThankYouApplicationController]);


  function ThankYouApplicationController($rootScope, $scope, $stateParams, businessService) {
    
    $scope.rootScopt = $rootScope;

    businessService.getBySlug($stateParams.businessSlug)
        .then(
            function (business) {
              $scope.business = business;
              $scope.location = businessService.locationBySlug($stateParams.locationSlug, business);
              $scope.position = businessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business);
            },
            function (err) {
              console.log(err)
            }
        );

  }
})();
