'use strict';

var myApp = angular.module('hirelyApp',
    [   
        'uiGmapgoogle-maps',
        'ui.router',
        'ui.bootstrap',
        'ui.grid',
        'firebase',
        'ngMask',
        'tc.chartjs',
        'hirelyApp.layout',
        'hirelyApp.home',
        'hirelyApp.shared',
        'hirelyApp.job',
        'hirelyApp.jobdetails',
        'hirelyApp.core',
        'hirelyApp.account',
        'hirelyApp.candidate'
    ])


    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider

          .state('app', {
              url: "/app",
              abstract: true,
              templateUrl: "app/layout/master.html"
          })
          .state('app.home', {
              url: '/home',
              parent: 'app',
              templateUrl: 'app/home/home.html',
              controller: 'HomeCtrl'
          })
          .state('app.login', {
              url: '/login',
              templateUrl: 'app/account/login.html',
              controller: 'LoginCtrl'
          })
          .state('app.job', {
              url: '/job',
              templateUrl: 'app/job/jobs.html',
              controller: 'JobCtrl'
          })
          .state('app.jobdetails', {
              url: '/jobdetails',
              templateUrl: 'app/jobdetails/jobDetails.html',
              controller: 'JobCtrl'
          })
          .state('app.register', {
              url: '/register',
              templateUrl: 'app/account/register.html',
              controller: 'RegisterCtrl'
          })
          .state('app.candidate', {
              url: '/candidate',
              abstract: true,
              templateUrl: 'app/candidate/candidate.html',
              authRequired: true,
              controller: 'CandidateCtrl'
          })
          .state('app.candidate.dashboard', {
              url: '/dashboard',
              templateUrl: 'app/candidate/candidate-dashboard.html',
              controller: 'CandidateDashboardCtrl',
              authRequired: true
          })
          .state('app.candidate.profile', {
              abstract: true,
              url: '/profile',
              templateUrl: 'app/candidate/candidate-profile.html',
              authRequired: true
             // controller: 'CandidateProfileCtrl'
          })
          .state('app.candidate.profile.basics', {
              url: '/basics',
              templateUrl: "app/candidate/candidate-profile-basics.html",
              controller: 'CandidateProfileBasicsCtrl',
              authRequired: true
          })
          .state('app.candidate.profile.availability', {
              url: '/Availability',
              templateUrl: 'app/candidate/candidate-profile-availability.html',
              //controller: 'CandidateProfileCtrl',
              authRequired: true
          })
          .state('app.candidate.profile.experience', {
              url: '/Experience',
              templateUrl: 'app/candidate/candidate-profile-experience.html',
             // controller: 'CandidateProfileCtrl',
              authRequired: true
          })
          .state('app.candidate.profile.personality', {
              url: '/candidateProfileEducation',
              templateUrl: 'app/candidate/candidate-profile-education.html',
             //  controller: 'CandidateProfileCtrl',
              authRequired: true
          })

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');
    })

myApp.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: '711561845732-pg1q3d3cn30f4jk07bmqno9qeio7unmg.apps.googleusercontent.com',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  });
});

myApp.controller('MainCtrl', function($scope, $firebaseArray, $firebaseObject, $http, uiGmapGoogleMapApi, uiGmapIsReady) {
    var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
    var fireRef = new Firebase(url);
    var maper;  // Google map object

   $scope.mapmarkers = $firebaseArray(fireRef);
    

    uiGmapGoogleMapApi
    .then(function(maps){

    $scope.googlemap = {};
    $scope.map = {
      center: {
        latitude: $scope.details.geometry.location.G,
        longitude: $scope.details.geometry.location.K
      },
      zoom: 14,
      pan: 1,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      options: $scope.mapOptions,
      control: {},
      events: {
        tilesloaded: function (maps, eventName, args) {
        },
        dragend: function (maps, eventName, args) {
        },
        zoom_changed: function (maps, eventName, args) {
        }
      }
    };
    });
    
    $scope.windowOptions = {
        show: false
    };

    $scope.onClick = function(data) {
        $scope.windowOptions.show = !$scope.windowOptions.show;
        console.log('$scope.windowOptions.show: ', $scope.windowOptions.show);
        console.log(data);
        alert(data);
    };

    $scope.closeClick = function() {
        $scope.windowOptions.show = false;
    };

        $scope.title = "Window Title!";
    
    uiGmapIsReady.promise()                                    // if no value is put in promise() it defaults to promise(1)
    .then(function(instances) {
        console.log(instances[0].map);                        // get the current map
    })
  
    .then(function(){
        $scope.addMarkerClickFunction($scope.markers);
    });

    $scope.markers = [
         {
            id: 0,
            coords: {
                latitude: 38.910586,
                longitude: -77.021683,
                },
            data: 'Compass Coffee'
        },
        {
            id: 1,
            coords: {
                latitude: 38.912109,
                longitude: -77.032374,
                },
            data: 'Barcelona Wine Bar'
        },
        {
            id: 2,
            coords: {
                latitude: 38.704282,
                longitude: -77.2277603,
                },
            data: 'hotel'
        },
       {
            id: 3,
            coords: {
                latitude: 38.910908,
                longitude: -77.032568,
                },
            data: 'The Bike Rack'
        },
        {
            id: 4,
            coords: {
                latitude: 38.897013,
                longitude: -77.02234,
                },
            data: 'Poste Modern Brasserie'
        },
        {
            id: 5,
            coords: {
                latitude: 38.905423,
                longitude: -77.059664,
                },
            data: 'Sprinkles Cupcakes'
        },
        {
            id: 6,
            coords: {
                latitude: 38.909291,
                longitude: -77.033443,
                },
            data: 'Wholefoods'
        },
        {
            id: 7,
            coords: {
                latitude: 38.897844,
                longitude: -77.033285,
                },
            data: 'Garrison & Sisson, Inc'
        },
        {
            id: 8,
            coords: {
                latitude: 38.902917,
                longitude: -77.037824,
                },
            data: 'BCG Attorney Search'
        }, 
        {
            id: 9,
            coords: {
                latitude: 38.891613,
                longitude: -77.001231,
                },
            data: 'Karson Butler Events'
        }, 
        {
            id: 10,
            coords: {
                latitude: 38.895273,
                longitude: -77.015736,
                },
            data: 'DCHR'
        },
        {
            id: 11,
            coords: {
                latitude: 38.895273,
                longitude: -77.015736,
                },
            data: 'DCHR'
        },
        {
            id: 12,
            coords: {
                latitude: 38.896921,
                longitude: -77.010342,
                },
            data: 'Roll Call, Inc.'
        },
        {
            id: 13,
            coords: {
                latitude: 38.912109,
                longitude: -77.032374,
                },
            data: 'Barcelona Wine Bar'
        },
        {
            id: 14,
            coords: {
                latitude: 38.912109,
                longitude: -77.032374,
                },
            data: 'Barcelona Wine Bar'
        },
        {
            id: 15,
            coords: {
                latitude: 38.910586,
                longitude: -77.021683,
                },
            data: 'Compass Coffee'
        },
        {
            id: 16,
            coords: {
                latitude: 38.905423,
                longitude: -77.059664,
                },
            data: 'Sprinkles Cupcakes'
        },
        {
            id: 17,
            coords: {
                latitude: 38.895273,
                longitude: -77.015736
                },
            data: 'DCHR'
        },
       {
            id: 18,
            coords: {
                latitude: $scope.details.geometry.location.G,
                longitude: $scope.details.geometry.location.K,
                },
            data: 'Job Location Search Area!'
        }
          
    ];


    $scope.addMarkerClickFunction = function(markersArray){
        angular.forEach(markersArray, function(value, key) {
            value.onClick = function(){
                    $scope.onClick(value.data);
                };
        });
    };  


    
  $scope.MapOptions = {
        minZoom : 3,
        zoomControl : true,
        draggable : true,
        navigationControl : true,
        mapTypeControl : true,
        scaleControl : true,
        streetViewControl : true,
        disableDoubleClickZoom : false,
        keyboardShortcuts : false,
        icon: "img/bluedot.png",
        styles : [{
          featureType : "poi",
          elementType : "labels",
          stylers : [{
            visibility : "off"
          }]
        }, {
          featureType : "transit",
          elementType : "all",
          stylers : [{
            visibility : "off"
          }]
        }],
    };
});