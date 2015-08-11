"use strict";

angular.module('hirelyApp.routes', ['ngRoute'])

   // configure views; the authRequired parameter is used for specifying pages
   // which should only be available while logged in
   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/home', {
         templateUrl: 'partials/home.html',
         controller: 'HomeCtrl'
      });

      $routeProvider.when('/job', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/job.html',
         controller: 'ONetCtrl'
      });
      $routeProvider.when('/jobdetails', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/job-details.html',
         controller: 'ONetCtrl'
      });
      $routeProvider.when('/can', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/candidate.html',
         controller: 'AccountCtrl'
      });

      $routeProvider.when('/candetails', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/candidate-details.html',
         controller: 'AccountCtrl'
      });
      
      $routeProvider.when('/account', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/account.html',
         controller: 'AccountCtrl'
      });

      $routeProvider.when('/login', {
         templateUrl: 'partials/login.html',
         controller: 'LoginCtrl'
      });

      $routeProvider.otherwise({redirectTo: '/home'});
   }]);