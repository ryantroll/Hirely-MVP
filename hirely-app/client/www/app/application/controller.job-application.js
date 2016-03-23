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
  .directive("resetPasswordForm", function() {
      return {
          restrict: 'A',
          templateUrl: 'app/account/password.tpl.html',
          controller: 'PasswordController',
          scope: true,
          transclude : false
      };
  })
  .filter('numberRound', function(){
    return function(value){
      return Math.round(value);
    }
  })
  .controller('JobApplicationController', ['$scope', '$rootScope', '$stateParams', '$state', '$q', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'AuthService', 'UserService', 'JobApplicationService', 'BusinessService', JobApplicationController]);


  function JobApplicationController($scope, $rootScope, $stateParams, $state, $q, uiGmapGoogleMapApi, uiGmapIsReady, AuthService, UserService, JobApplicationService, BusinessService) {

    $scope.isAuth = null;
    /**
     * [availability this scope is the parent of availability step scope and this variaable is needed there]
     * @type {Object}
     */
    $scope.availability = {};

    /**
     * [jobApplication a parent object to hold variables to be set by child scope
     * if child scope set direct variable of scope the will be overwriten]
     * @type {Object}
     */
    $scope.jobApplication = {
      application: null, //// applicatin object after it get saved in db
      isNewUser: false //// this variable will be set in register form controller or login form congroller to identify new user from old logged in user
    };


    BusinessService.getBySlug($stateParams.businessSlug)
    .then(
      function(business){

        $scope.business = business;
        $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);

        $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business)


        /**
         * Check if user is logged in and move to next promise
         */
        return AuthService.isUserLoggedIn();
      },
      function(err){
        console.log(err)
      }
    )
    .then(
      function(isAuth){
        $scope.isAuth = isAuth;
        /**
         * user is logged in continue data loading
         */
        return getApplicationData();
      },
      function(err){
        $scope.isAuth = false;
        /**
         * breack the promise chain as user is not logged id
         */
        return $q.reject();
      }
    )//// .then
    .finally(
      function(){
        /**
         * Set the steps if only user is logedin
         */
        if(true === $scope.isAuth){
           setSteps();
        }
        initialize();
      }
    );/// .finally

    /**
     * [getApplicationData this function created to separate the promise chain,
     * if user not logged in there is not need to load application data and user profile fileds
     * this function will be called again inside UserLoggedIn event below to continue data loading]
     * @return {promise} [description]
     */
    function getApplicationData(){
        if (!AuthService.isUserLoggedIn()) {
            return;
        }
        $scope.userData = AuthService.currentUser;

      return JobApplicationService.isApplicationExists(AuthService.currentUser._id, $scope.position._id)
      .then(
        function(app){
          if(app){
            $scope.jobApplication.application = app;
          }
        }
      )

    }//// fun. getApplicationData

    function setSteps(){

      $scope.steps = [

        {
          templateUrl: '/app/user/profile/basic/basic.tpl.html',
          controller: 'ProfileBasicController',
          hasForm: false
        },
        {
          templateUrl: '/app/user/profile/experience/experience.tpl.html',
          controller: 'ProfileExperienceController',
          hasForm: false
        },
        {
          templateUrl: '/app/user/profile/education/education.tpl.html',
          controller: 'ProfileEducationController',
          hasForm: false
        },
        {
          templateUrl: '/app/user/profile/personality/personality.tpl.html',
          controller: 'ProfilePersonalityController'
        },
        {
          templateUrl: '/app/user/profile/availability/availability.tpl.html',
          controller: 'ProfileAvailabilityController',
          hasForm: true
        },
        {
          templateUrl: '/app/application/pre-screen/pre-screen.tpl.html',
          controller: 'PreScreenController',
          hasForm: true
        }
      ];
    }//// fun. setStpes

    function initialize(){

      $scope.$on('UserLoggedIn', function(event, user){

        $scope.registerFrom = false;
        $scope.loginForm = false;

        /**
         * after user logged in continue data loading
         */
        getApplicationData()
        .finally(
          function(){
            setSteps();
            $scope.isAuth = true;
          }
        );/// .finally

      });

      $scope.$on('UserLoggedOut', function(event){
        $scope.isAuth = false;

        $scope.registerFrom = false;
        $scope.loginForm = true;
      });

      /**
       * initiate layout template variables
       */
      $scope.dataError = !$scope.business || !$scope.location || !$scope.position;
      $scope.dataLoaded = true;
      $scope.registerFrom = true;
      $scope.loginForm = false;
      $scope.passwordForm = false;

      if(!$scope.dataError){
        /**
         * Set required variable in parent $scope app/layout/application-master.js
         * @type {[type]}
         */
        $scope.layoutModel.business = $scope.business.name;
        $scope.layoutModel.position = $scope.position.title;
        $scope.layoutModel.location = $scope.location.name;

        $scope.layoutModel.noHeader = true;
      }//// if!dataError

    }//// fun. initialize

    $rootScope.$on('ShowLogin', function(){
      $scope.registerFrom = false;
      $scope.passwordForm = false;
      $scope.loginForm = true;
    })

    $rootScope.$on('ShowRegister', function(){
      $scope.registerFrom = true;
      $scope.passwordForm = false;
      $scope.loginForm = false;
    })

    $rootScope.$on('ShowForgotPassword', function(){
      $scope.registerFrom = false;
      $scope.loginForm = false;
      $scope.passwordForm = true;
    })

    /**
     * [setInitialStep used inside the template in multiStepForm directive
     * to set the initiale step based on user profile]
     */
    $scope.setInitialStep = function(){
      // var initialStep = 1;
      if(
        !(angular.isDefined(AuthService.currentUser.mobile) && AuthService.currentUser.mobile &&
        angular.isDefined(AuthService.currentUser.dateOfBirth) && AuthService.currentUser.dateOfBirth &&
        angular.isDefined(AuthService.currentUser.postalCode) && AuthService.currentUser.postalCode)
      ){
        return 1;
      }

      if( !(angular.isDefined($scope.userData) && Array.isArray($scope.userData.workExperience) && $scope.userData.workExperience.length > 0) ){
        return 2;
      }

      if( !(angular.isDefined($scope.userData) && Array.isArray($scope.userData.education) && $scope.userData.education.length > 0) ){
        return 3;
      }

      if( !(angular.isDefined($scope.userData) && Array.isArray($scope.userData.personalityExams) && $scope.userData.personalityExams.length > 0) ){
        return 4;
      }

      if( !(angular.isDefined($scope.userData.availability.hoursPerWeekMin) && $scope.userData.availability.hoursPerWeekMin > 0) ){
        return 5;
      }

      return 6;
    }

    /**
     * [finish trigger when user get to the last step pre-screen and click finish button, will reidrect the user to thank you page]
     * @return {[type]} [description]
     */
    $scope.finish = function(){
      delete $scope.layoutModel.noHeader;
      $state.go('application.done', {businessSlug:$scope.business.slug, locationSlug:$scope.location.slug, positionSlug:$scope.position.slug});
    }

  }
})();
