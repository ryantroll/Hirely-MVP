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
        'hirelyApp.user'
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
              templateUrl: 'app/user/login.html',
              controller: 'LoginCtrl'
          })
          .state('app.register', {
              url: '/register',
              views: {
                  'mainContent': {
                      templateUrl: 'app/user/register.html',
                      //controller: 'RegisterCtrl'
                  }
              }
          })
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');
    })
   ;
