/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('ThankYouApplicationController', ['$scope', '$stateParams', '$state', 'AuthService', 'UserService', 'JobApplicationService', 'HirelyApiService', ThankYouApplicationController]);


  function ThankYouApplicationController($scope, $stateParams, $state, AuthService, UserService, JobApplicationService, HirelyApiService) {

    // delete $scope.layoutModel.noHeader;
    // delete $scope.layoutModel.business;
    // delete $scope.layoutModel.location;
    // delete $scope.layoutModel.position;

    AuthService.getAuth()
    .then(
      function(isAuth){
        initialize();
      },
      function(err){

      }
    )

    function initialize(){
      $scope.name = AuthService.currentUser.firstName;
    }

  }
})();
