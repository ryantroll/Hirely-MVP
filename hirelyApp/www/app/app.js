'use strict';
angular.module('hirelyApp',
    [   'uiGmapgoogle-maps',
        'ui.router',
        'ui.bootstrap',
        'firebase',
        'hirelyApp.layout',
        'hirelyApp.home',
        'hirelyApp.shared',
        'hirelyApp.job',
        'hirelyApp.core',
        'hirelyApp.account'
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
          .state('app.register', {
              url: '/login',
              templateUrl: 'app/account/register.html',
              controller: 'RegisterCtrl'
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
.controller("mapController", function($scope, uiGmapGoogleMapApi) {
  
  // Define variables for our Map object
  var areaLat      = 44.2126995,
      areaLng      = -100.2471641,
      areaZoom     = 3;

  uiGmapGoogleMapApi.then(function(maps) {
    $scope.map     = { center: { latitude: areaLat, longitude: areaLng }, zoom: areaZoom };
    $scope.options = { scrollwheel: false };
  });

});
 
;