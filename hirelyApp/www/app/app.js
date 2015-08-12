'use strict';
angular.module('hirelyApp',
    [
        'ui.router',
        'ui.bootstrap',
        'firebase',
        'hirelyApp.layout',
        'hirelyApp.home',
        'hirelyApp.shared',
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
              controller: 'HomeCtrl'
          })
          .state('app.register', {
              url: '/login',
              templateUrl: 'app/account/register.html',
              controller: 'RegisterCtrl'
          })
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');
    })
   ;
