/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('mean.hirely').controller('JobApplicationController', ['$scope', '$stateParams', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'UserService', JobApplicationController]);


  function JobApplicationController($scope, $stateParams, uiGmapGoogleMapApi, uiGmapIsReady , UserService) {

    // test jobs
    var testJobOne = {
      position: "Barista",
      city: "Washington DC",
      lng: "-77.0576414",
      lat: "38.9340854",
      business: "Starbucks",
      photoUrl: "http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2013/12/starbucks-canal-street-NOLA-store-6.jpg"
    };

    var testJobTwo = {
      position: "Cashier",
      city: "Boca Raton, Fl",
      lng: "-80.1692048",
      lat: "26.3503604",
      business: "McDonald's",
      photoUrl: "http://retaildesignblog.net/wp-content/uploads/2011/08/McDonald-s-flagship-restaurant-by-SHH-London.jpg"
    };

    var jobInfo = {};


    $scope.stepOneLoaded = false;
    $scope.stepTwoLoaded = false;
    //$scope.stepThreeLoaded = false; step three is special case, maintained in step controller
    $scope.stepFourLoaded = false;
    $scope.stepFiveLoaded = false;


    // test Job IDs
    var currentJob = $stateParams.jobId;
    switch (currentJob) {
      case "122122":
        $scope.jobInfo = testJobOne;
        break;
      case "130130":
        $scope.jobInfo = testJobTwo;
        break;
    }


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


    uiGmapGoogleMapApi
      .then(function (maps) {
        console.log('redy');
        $scope.googlemap = {};
        $scope.map = {
          center: {
            latitude: $scope.jobInfo.lat,
            longitude: $scope.jobInfo.lng
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


    //form steps
    $scope.steps = [
      {
        templateUrl: '/app/application/step-1/step-one.tpl.html',
        controller: 'StepOneController',
        hasForm: false
      },
      {
        templateUrl: '/app/application/step-2/step-two.tpl.html',
        controller: 'StepTwoController',
        hasForm: true
      },
      {
        templateUrl: '/app/application/step-3/step-three.tpl.html',
        controller: 'StepThreeController'
      },
      {
        templateUrl: '/app/application/step-4/step-four.tpl.html'
      },
      {
        templateUrl: '/app/application/step-5/step-five.tpl.html',
        controller: 'StepFiveController',
        hasForm: true
      }
    ];




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



  }
})();
