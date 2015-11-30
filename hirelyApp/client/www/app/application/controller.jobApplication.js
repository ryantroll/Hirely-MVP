/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('JobApplicationController', ['$scope', '$stateParams', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'UserService', JobApplicationController]);


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
        templateUrl: '/app/application/steps/step-one.tpl.html',
        title: 'Get the source',
        hasForm: true
      },
      {
        templateUrl: '/app/application/steps/step-TWO.tpl.html',
        title: 'Add it to your app',
        isolatedScope: true,
        controller: 'StepTwoController',
        hasForm: true
      },
      {
        templateUrl: '/angular-multi-step-form/examples/1/step3.html',
        title: 'Create your multi step forms / wizzards'
      },
      {
        templateUrl: '/angular-multi-step-form/examples/1/step4.html',
        title: 'Read the docs'
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
    }

    var user = UserService.getUserById('-444').then(function(user){
            $scope.firstname = user.firstName;
            $scope.lastname = user.lastName;
            $scope.email = user.email;
            $scope.mobile = user.mobile;
            $scope.address = user.address.formattedAddress;
            $scope.address_unit = user.address.unit;
            $scope.address_city = user.address.city;
            $scope.state = user.address.state;
            $scope.zipcode = user.address.zipCode;
    });
    
  }
})();