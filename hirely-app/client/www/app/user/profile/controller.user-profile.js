/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('UserProfileController', ['$scope', '$stateParams', '$state', 'AuthService', 'UserService', 'JobApplicationService', 'HirelyApiService', UserProfileController]);


  function UserProfileController($scope, $stateParams, $state, AuthService, UserService, JobApplicationService, HirelyApiService) {


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
          templateUrl: '/app/user/profile/step-1/step-one.tpl.html',
          controller: 'StepOneController',
          hasForm: true
        },
        {
          templateUrl: '/app/user/profile/step-2/step-two.tpl.html',
          controller: 'StepTwoController',
          hasForm: false
        },
        {
          templateUrl: '/app/user/profile/step-2-e/step-two-e.tpl.html',
          controller: 'StepTwoEController',
          hasForm: false
        },
        {
          templateUrl: '/app/user/profile/step-3/step-three.tpl.html',
          controller: 'StepThreeController'
        },
        {
          templateUrl: '/app/user/profile/step-5/step-five.tpl.html',
          controller: 'StepFiveController',
          hasForm: true
        },
        {
          templateUrl: '/app/user/profile/step-6/step-six.tpl.html',
          controller: 'StepSixController',
          hasForm: false
        }
      ];


      /**
       * Monitro is user is logged out and reload the current state
       */
      $scope.$on('UserLoggedOut', function(){
        if($scope.application){
           delete $scope.application;
           $state.reload();
        }
      });/// $on UserLoggedOut

    })();//// fun. init()

    /***
     *
     * Map stuff:
     *
     *
     *
     ***/








    //navigation animation & init
    angular.element(document).ready(function () {
      var steps = $('.steps');

      // Timer for delay, must same as CSS!
      var stepsTimer = 200,
        stepsTimerL = 400;

      // remove mini between current
      steps.addClass('is-mini');
      steps.each(function (i) {
        var self = $(this);
        if (self.hasClass('is-current')) {
          self.removeClass('is-mini');
          self.prev().removeClass('is-mini');
          self.next().removeClass('is-mini');
        }
      });

      // Bounce Animation
      steps.addClass('is-circle-entering');

      // Delay for BounceIn
      setTimeout(function () {
        steps.each(function (i) {
          var self = $(this),
            timer = (stepsTimer * 2) * i;
          setTimeout(function () {
            // Line Flow
            self.addClass('is-line-entering');
            if (self.hasClass('is-current')) {
              // Title FadeIn
              steps.addClass('is-title-entering');
            }
          }, timer);
        });
      }, stepsTimer);

    });


    $scope.submitStepOne = function () {
      console.log(hello);
    }

    $scope.saveForm = function(){
      alert('save');
    }


  }
})();
