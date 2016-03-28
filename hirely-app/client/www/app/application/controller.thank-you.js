/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('ThankYouApplicationController', ['$scope', '$stateParams', '$state', 'AuthService', 'UserService', 'JobApplicationService', 'HirelyApiService', ThankYouApplicationController]);


  function ThankYouApplicationController($scope, $stateParams, $state, authService, userService, JobApplicationService, HirelyApiService) {

    // delete $scope.layoutModel.noHeader;
    // delete $scope.layoutModel.business;
    // delete $scope.layoutModel.location;
    // delete $scope.layoutModel.position;

    if (authService.isUserLoggedIn()) {
      initialize();
    }

    function initialize(){
      $scope.name = authService.currentUser.firstName;
    }

  }
})();
