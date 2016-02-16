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
  .directive("applicationWorkflow", function() {
      return {
          restrict: 'A',
          templateUrl: 'app/user/profile/user-profile.html',
          controller: 'UserProfileController',
          scope: true,
          transclude : false
      };
  })
  .controller('JobApplicationController', ['$scope', '$rootScope', '$stateParams', '$state', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'AuthService', 'UserService', 'JobApplicationService', 'BusinessService', JobApplicationController]);


  function JobApplicationController($scope, $rootScope, $stateParams, $state, uiGmapGoogleMapApi, uiGmapIsReady, AuthService, UserService, JobApplicationService, BusinessService) {

    $scope.isAuth = null;

    BusinessService.getBySlug($stateParams.businessSlug)
    .then(
      function(business){

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

      if(!$scope.dataError){
        $scope.layoutModel.business = $scope.business.name;
        $scope.layoutModel.position = $scope.position.title;
        $scope.layoutModel.location = $scope.location.name;
      }

    }

    $rootScope.$on('ShowLogin', function(){
      $scope.registerFrom = false;
      $scope.loginForm = true;
    })

    $rootScope.$on('ShowRegister', function(){
      $scope.registerFrom = true;
      $scope.loginForm = false;
    })

    $scope.$on('UserLoggedIn', function(event, user){
      $scope.registerFrom = false;
      $scope.loginForm = false;

      $scope.isAuth = true;
    })

    $scope.$on('UserLoggedOut', function(event){
      $scope.isAuth = false;

      $scope.registerFrom = false;
      $scope.loginForm = true;

    })

  }
})();
