'use strict';

var myApp = angular.module('hirelyApp',
  [
    'uiGmapgoogle-maps',
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.typeahead',
    'ui.grid',
    'uiGmapgoogle-maps',
    'firebase',
    'ngMask',
    'ng-currency',
    'rzModule',
    'angular-flexslider',
    'ui-notification',
    'hirelyApp.layout',
    'hirelyApp.home',
    'hirelyApp.shared',
    'hirelyApp.job',
    'hirelyApp.jobdetails',
    'hirelyApp.core',
    'hirelyApp.account',
    'hirelyApp.candidate',
    'hirelyApp.manager',
    'ngSanitize',
    'multiStepForm'

  ])


  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('app', {
        //url: "/app",
        abstract: true,
        templateUrl: 'app/layout/master.html'
      })
      .state('app.home', {
        url: '/',
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
        url: '/job?placeId&distance&occupationId&wage',
        parent: 'app',
        templateUrl: 'app/job/job-search.html',
      })
      .state('app.jobdetails', {
        url: '/jobdetails?jobId',
        templateUrl: 'app/jobdetails/jobDetails.html',
      })
      .state('app.register', {
        url: '/register',
        templateUrl: 'app/account/register.html',
        controller: 'RegisterCtrl'
      })
      .state('app.hmregister', {
        url: '/hmregister',
        templateUrl: 'app/manager/hmRegister.html',
        controller: 'HMRegisterCtrl'
      })
      .state('app.busDashboard', {
        url: '/busDashboard',
        templateUrl: 'app/manager/hmDashboard.html',
        controller: 'HMRegisterCtrl'
      })
      .state('app.hmPosition', {
        url: '/hmPosition',
        templateUrl: 'app/manager/hmPosition.html',
        controller: 'HMRegisterCtrl'
      })
      .state('app.hmHiring', {
        url: '/hmHiring',
        templateUrl: 'app/manager/hmHiring.html',
        controller: 'HMRegisterCtrl'
      })
      // .state('app.candidate', {
      //   url: '/candidate',
      //   abstract: true,
      //   templateUrl: 'app/candidate/candidate.html',
      //   authRequired: true,
      //   controller: 'CandidateCtrl'
      // })
      // .state('app.candidate.dashboard', {
      //   url: '/dashboard',
      //   templateUrl: 'app/candidate/candidate-dashboard.html',
      //   controller: 'CandidateDashboardCtrl',
      //   authRequired: true
      // })
      // .state('app.candidate.profile', {
      //   abstract: true,
      //   url: '/profile',
      //   templateUrl: 'app/user/profile/candidate-profile.html',
      //   controller: 'CandidateProfileCtrl',
      //   authRequired: true,
      //   resolve: {
      //     profile: function ($q, CandidateService, UserService) {
      //       //retrieve profile before loading
      //       var user = UserService.getCurrentUser();
      //       return CandidateService.getProfile(user.userId).then(function (profile) {

      //         return profile;
      //       }, function (err) {
      //         deferred.reject(err);
      //       });

      //     }
      //   }
      // })
      // .state('app.candidate.profile.basics', {
      //   url: '/basics',
      //   templateUrl: 'app/candidate/profile/candidate-profile-basics.html',

      //   controller: 'CandidateProfileBasicsCtrl',
      //   authRequired: true
      // })
      // .state('app.candidate.profile.availability', {
      //   url: '/Availability',
      //   templateUrl: 'app/candidate/profile/candidate-profile-availability.html',
      //   authRequired: true
      // })
      // .state('app.candidate.profile.experience', {
      //   url: '/Experience',
      //   templateUrl: 'app/candidate/profile/candidate-profile-experience.html',
      //   authRequired: true
      // })
      // .state('app.candidate.profile.personality', {
      //   url: '/Personality',
      //   templateUrl: 'app/candidate/profile/candidate-profile-personality.html',
      //   authRequired: true
      // })
      //.state('app.application', {
      //  url: '/:jobId/apply',
      //  templateUrl: 'app/application/job-application.html',
      //  controller: 'JobApplicationController',
      //  authRequired: true
      //})
      .state('user', {
        url:'/user',
        templateUrl: 'app/user/user.html',
        controller: 'UserController',
        authRequired: true
      })
      .state('user.profile', {
        url:'/profile',
        templateUrl: 'app/user/profile/user-profile.html',
        controller: 'UserProfileController',
        authRequired: true
      })
      .state('app.application', {
        url: '/:businessSlug/:locationSlug/:positionSlug/:variantSlug/apply',
        templateUrl: 'app/application/job-application.html',
        controller: 'JobApplicationController',
        //authRequired: true
      })


    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/');
  });
