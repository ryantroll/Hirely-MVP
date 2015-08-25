'use strict';
angular.module('hirelyApp',
    [   
        'uiGmapgoogle-maps',
        'ui.router',
        'ui.bootstrap',
        'firebase',
        'tc.chartjs',
        'hirelyApp.layout',
        'hirelyApp.home',
        'hirelyApp.shared',
        'hirelyApp.job',
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
          .state('app.jobDetails', {
              url: '/jobDetails',
              templateUrl: 'app/jobdetails/jobDetails.html',
              controller: 'JobCtrl'
          })
          .state('app.register', {
              url: '/login',
              templateUrl: 'app/account/register.html',
              controller: 'RegisterCtrl'
          })
          .state('app.candidateProfile', {
              url: '/candidateP rofile',
              templateUrl: 'app/candidate/candidate-profile.html',
              controller: 'CandidateProfileCtrl'
          })
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');
    })

 .config(function(uiGmapGoogleMapApiProvider) {
   
   uiGmapGoogleMapApiProvider.configure({
    key: '711561845732-pg1q3d3cn30f4jk07bmqno9qeio7unmg.apps.googleusercontent.com',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
 });
})  

.controller("mapController", function($scope, $http, $firebaseArray, uiGmapGoogleMapApi) {
  
  // Define variables for our Map object

 var areaZoom  = 11;
 var firebaseUrl= 'https://shining-torch-5144.firebaseio.com/jobOpenings';
 var fireRef = new Firebase(firebaseUrl);

  uiGmapGoogleMapApi.then(function(maps) {
    
        // for the map
        $scope.map = {
            center: {
                latitude: 38.9047,
                longitude: -77.0164
            },
            draggable: true,
            zoom: 15
        };
       // map options
        $scope.options = {
            scrollwheel: true,
            panControl: true,
            rotateControl: true,
            scaleControl: true,
            streetViewControl: true
        };
       // map marker
        $scope.marker = {
            id: 0,
            coords: {
                latitude:  38.9047,
                longitude: -77.0164
            },
            options: {
                icon: 'img/marker.jpg',
                draggable: false,
                title: 'test',
                animation: 1 // 1: BOUNCE, 2: DROP
                
            }
        };

    });


});
 
