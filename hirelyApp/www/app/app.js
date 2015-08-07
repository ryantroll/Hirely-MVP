'use strict';
angular.module('hirelyApp', ['ui.router', 'ui.bootstrap', 'hirelyApp.layout', 'hirelyApp.home', 'hirelyApp.shared'])

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
              templateUrl: 'app/home/login.html'
          })
          .state('app.register', {
              url: '/register',
              views: {
                  'mainContent': {
                      templateUrl: 'app/home/register.html',
                      //controller: 'LoginCtrl'
                  }
              }
          })
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');
    })
   ;
