/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('UserProfileController', ['$rootScope', '$scope', '$stateParams', '$state', 'AuthService', 'UserService', 'JobApplicationService', 'HirelyApiService', UserProfileController])




  function UserProfileController($rootScope, $scope, $stateParams, $state, authService, userService, JobApplicationService, HirelyApiService) {

    $scope.availability = {};

    /**
     * Load all requied stpes before loading view
     * @return {[type]} [description]
     */
    (function init() {

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

    })();//// fun. init()

    $scope.finish = function(){
      console.log("UP:Going home");
      $state.go('master.default.home')
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
