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
  .controller('JobApplicationController', ['$scope', '$stateParams', '$state', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'AuthService', 'UserService', 'JobApplicationService', 'HirelyApiService', JobApplicationController]);


  function JobApplicationController($scope, $stateParams, $state, uiGmapGoogleMapApi, uiGmapIsReady, AuthService, UserService, JobApplicationService, HirelyApiService) {

    $scope.isAuth = null;

    AuthService.getAuth()
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
      $scope.registerFrom = true;
    }

  }
})();
