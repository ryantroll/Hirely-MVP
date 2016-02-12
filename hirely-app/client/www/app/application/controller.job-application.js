/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp')
  .directive("registerForm", function() {
      return {
          restrict: 'A',
          templateUrl: 'app/account/register.tpl.html',
          controller: 'RegisterController',
          scope: true,
          transclude : false
      };
  })
  .directive("loginForm", function() {
      return {
          restrict: 'A',
          templateUrl: 'app/account/login.tpl.html',
          controller: 'LoginController',
          scope: true,
          transclude : false
      };
  })
  .controller('JobApplicationController', ['$scope', '$stateParams', '$state', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'AuthService', 'UserService', 'JobApplicationService', 'BusinessService', JobApplicationController]);


  function JobApplicationController($scope, $stateParams, $state, uiGmapGoogleMapApi, uiGmapIsReady, AuthService, UserService, JobApplicationService, BusinessService) {

    $scope.isAuth = null;

    BusinessService.getBySlug($stateParams.businessSlug)
    .then(
      function(business){
        console.log($stateParams.businessSlug)
        $scope.business = business;
        $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);

        $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business)

        /**
         * Check if user is logged in and move to next promise
         */
        return AuthService.getAuth();
      },
      function(err){
        console.log(err)
      }
    )
    .then(
      function(isAuth){
        $scope.isAuth = isAuth;
        initialize();
      },
      function(err){
        $scope.isAuth = false;
        initialize();
      }
    )

    function initialize(){
      $scope.dataError = !$scope.business || !$scope.location || !$scope.position;
      $scope.dataLoaded = true;
      $scope.registerFrom = true;
    }

  }
})();
