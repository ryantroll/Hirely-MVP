/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('UserProfileController', ['$scope', '$stateParams', '$state', 'AuthService', 'UserService', 'JobApplicationService', 'HirelyApiService', UserProfileController])




  function UserProfileController($scope, $stateParams, $state, authService, userService, JobApplicationService, HirelyApiService) {

    $scope.availability = {};

    /**
     * Load all requied stpes before loading view
     * @return {[type]} [description]
     */
    (function init() {


      if (!authService.isUserLoggedIn()) {
        $state.go("app.account.login");
      }
      $scope.userIsSynced = false;
      authService.syncCurrentUserFromDb().then(function() {
        $scope.userIsSynced = true;
      });

      /**
       * Set the form steps
       */
      $scope.steps = [

        {
          templateUrl: '/app/user/profile/basic/basic.tpl.html',
          controller: 'ProfileBasicController',
          hasForm: true
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
          controller: 'ProfilePersonalityController',
          hasForm: true
        },
        {
          templateUrl: '/app/user/profile/availability/availability.tpl.html',
          controller: 'ProfileAvailabilityController',
          hasForm: true
        },

      ];


      /**
       * Monitor is user is logged out and reload the current state
       */
      $scope.$on('UserLoggedOut', function(){
        if($scope.application){
           delete $scope.application;
           $state.reload();
        }
      });/// $on UserLoggedOut

    })();//// fun. init()

    $scope.finish = function(){
      $state.go('app.home')
    }

    function semiFixedFooter() {
      var windowHeight = getBody().clientHeight;
      var docHeight = $("body > .ng-scope").height();

      if (windowHeight > docHeight) {
        $(".multi-step-container footer").addClass("fixedBottom");
      } else {
        $(".multi-step-container footer").removeClass("fixedBottom");
      }
    }

    setInterval(semiFixedFooter, 100);

    var loadingBarLocation = 0;
    setInterval(function() {
      loadingBarLocation = (loadingBarLocation + 1) % 5;
      $(".loadingBar div").css("margin-left", loadingBarLocation*20+"%");
    }, 300);
    
  }
})();
