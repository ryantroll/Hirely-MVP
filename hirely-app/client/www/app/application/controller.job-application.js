/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('JobApplicationController', ['$scope', '$stateParams', '$state', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'AuthService', 'UserService', 'JobApplicationService', 'HirelyApiService', JobApplicationController]);


  function JobApplicationController($scope, $stateParams, $state, uiGmapGoogleMapApi, uiGmapIsReady, AuthService, UserService, JobApplicationService, HirelyApiService) {


    var jobInfo = {};


    $scope.stepOneLoaded = false;
    $scope.stepTwoLoaded = false;
    //$scope.stepThreeLoaded = false; step three is special case, maintained in step controller
    $scope.stepFourLoaded = false;
    $scope.stepFiveLoaded = false;

    /**
     * this a parent scope for each step
     * each step scope will inheret from this scope
     * We should define the object that we need to keep through steps
     */
    if(!angular.isObject($scope.availability)) $scope.availability = {};
    $scope.businessSlug = $stateParams.businessSlug;
    $scope.locationSlug = $stateParams.locationSlug;
    $scope.positionSlug = $stateParams.positionSlug;
    $scope.variantSlug = $stateParams.variantSlug;

    /**
     * [application to hold the aplicaiton object if user is already applied]
     * @type {object}
     */
    $scope.application = null;

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
          templateUrl: '/app/application/step-1/step-one.tpl.html',
          controller: 'StepOneController',
          hasForm: true
        },

        {
          templateUrl: '/app/application/step-2/step-two.tpl.html',
          controller: 'StepTwoController',
          hasForm: false
        },
        {
          templateUrl: '/app/application/step-3/step-three.tpl.html',
          controller: 'StepThreeController'
        },
        {
          templateUrl: '/app/application/step-4/step-four.tpl.html',
          controller: 'StepFourController',
          hasForm: true
        },
        {
          templateUrl: '/app/application/step-5/step-five.tpl.html',
          controller: 'StepFiveController',
          hasForm: true
        },
        {
          templateUrl: '/app/application/step-6/step-six.tpl.html',
          controller: 'StepSixController',
          hasForm: false
        }
      ];
      /**
       * Get the business data based on slugs in url
       */
      if(angular.isDefined($scope.businessSlug)) {
        //$scope.businessInfo = HirelyApiService.businesses("compass-coffee").get()
        HirelyApiService.businesses($scope.businessSlug).get().then(function(business) {
          // console.dir("bus: ");
          // console.dir(business);
          $scope.business = business;

          // Get the sub-objects
          $scope.location = business.locations[business.locationSlugs[$scope.locationSlug]];
          $scope.updateMap();
          $scope.position = business.positions[business.positionSlugs[$scope.positionSlug]];
          $scope.variant = business.variants[business.variantSlugs[$scope.variantSlug]];

          if(!angular.isDefined($scope.business)) {
            console.log("business not found.");
          }
          if(!angular.isDefined($scope.location)) {
            console.log("location not found.");
          }
          if(!angular.isDefined($scope.position)) {
            console.log("position not found.");
          }
          if(!angular.isDefined($scope.variant)) {
            console.log("variant not found.");
          }

          /**
           * find if there application already saved for this user
           */

          AuthService.getAuth()
          .then(
            function(isAuth){
              if(true === isAuth){
                return JobApplicationService.isApplicationExists(AuthService.currentUserID, $scope.variant._id);
              }
              else{
                return null;
              }
            },
            function(err){
              console.log(err);
              return null;
            }
          )//// .then
          .then(
            function(jobApp){
              if(jobApp){
                $scope.application = jobApp;
                /**
                 * Notify child scope about the end of data loading
                 * so they can access the data in daddy and granddaddy
                 */
                $scope.$broadcast('data-loaded');
              }/// if jobApp
            },/// fun. reslove
            function(err){

            }
          )//// .then



        })//// .get().then()
      }/// if define businesSlug

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


    $scope.mapOptions = {
      styles: hirelyCustomMap,
      disableDefaultUI: true
    };


    $scope.updateMap = function() {
      uiGmapGoogleMapApi
        .then(function (maps) {
          console.log('updateMap');
          console.log($scope.location.lat);
          console.log($scope.location.lng);
          $scope.googlemap = {};
          $scope.map = {
            center: {
              latitude: $scope.location.lat,
              longitude: $scope.location.lng
            },
            zoom: 10,
            pan: 1,
            options: $scope.mapOptions,
            control: {},
            clusterOptions: {
              title: 'hirely',
              gridSize: 20,
              ignoreHidden: true,
              minimumClusterSize: 1,
              zoomOnClick: false
            }
            //events: {
            //  tilesloaded: function (maps, eventName, args) {
            //  },
            //  dragend: function (maps, eventName, args) {
            //  },
            //  zoom_changed: function (maps, eventName, args) {
            //  }
            //}
          };
        });
    };







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

    $scope.xpItems = [];
    $scope.addJobXp = function () {
      console.log($scope.company);
      $scope.xpItems.push(
        {
          company: $scope.company,
          position: $scope.position,
          description: $scope.description
        }
      )
    };


    $scope.submitStepOne = function () {
      console.log(hello);
    }

    $scope.saveForm = function(){
      alert('save');
    }


  }
})();
