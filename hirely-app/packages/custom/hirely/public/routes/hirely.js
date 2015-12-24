'use strict';

angular.module('mean.hirely',
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
    'mean.hirely.layout',
    'mean.hirely.home',
    'mean.hirely.shared',
    'mean.hirely.job',
    'mean.hirely.jobdetails',
    'mean.hirely.core',
    'mean.hirely.account',
    'mean.hirely.candidate',
    'mean.hirely.manager',
    'ngSanitize',
    'multiStepForm'
	]
))



.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider

    .state('hirely example page', {
      url: '/hirely/example',
      templateUrl: 'hirely/views/index.html'
    })

    // .state('app', {
    //   url: "/app",
    //   abstract: true,
    //   templateUrl: 'hirely/layout/master.html'
    // })
    .state('app.home', {
      url: '/home',
      parent: 'app',
      templateUrl: 'hirely/home/home.html',

      controller: 'HomeCtrl'
    })
    // .state('app.login', {
    //   url: '/login',
    //   templateUrl: 'hirely/account/login.html',
    //   controller: 'LoginCtrl'
    // })
    // .state('app.job', {
    //   url: '/job?placeId&distance&occupationId&wage',
    //   parent: 'app',
    //   templateUrl: 'hirely/job/job-search.html',
    // })
    // .state('app.jobdetails', {
    //   url: '/jobdetails?siteId&positionId&placeId',
    //   templateUrl: 'hirely/jobdetails/jobDetails.html',
    // })
    // .state('app.register', {
    //   url: '/register',
    //   templateUrl: 'hirely/account/register.html',
    //   controller: 'RegisterCtrl'
    // })
    // .state('app.hmregister', {
    //   url: '/hmregister',
    //   templateUrl: 'hirely/manager/hmRegister.html',
    //   controller: 'HMRegisterCtrl'
    // })
    // .state('app.busDashboard', {
    //   url: '/busDashboard',
    //   templateUrl: 'hirely/manager/hmDashboard.html',
    //   controller: 'HMRegisterCtrl'
    // })
    // .state('app.hmPosition', {
    //   url: '/hmPosition',
    //   templateUrl: 'hirely/manager/hmPosition.html',
    //   controller: 'HMRegisterCtrl'
    // })
    // .state('app.hmHiring', {
    //   url: '/hmHiring',
    //   templateUrl: 'hirely/manager/hmHiring.html',
    //   controller: 'HMRegisterCtrl'
    // })
    // .state('app.candidate', {
    //   url: '/candidate',
    //   abstract: true,
    //   templateUrl: 'hirely/candidate/candidate.html',
    //   authRequired: true,
    //   controller: 'CandidateCtrl'
    // })
    // .state('app.candidate.dashboard', {
    //   url: '/dashboard',
    //   templateUrl: 'hirely/candidate/candidate-dashboard.html',
    //   controller: 'CandidateDashboardCtrl',
    //   authRequired: true
    // })
    // .state('app.candidate.profile', {
    //   abstract: true,
    //   url: '/profile',
    //   templateUrl: 'hirely/candidate/profile/candidate-profile.html',
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
    //   templateUrl: 'hirely/candidate/profile/candidate-profile-basics.html',

    //   controller: 'CandidateProfileBasicsCtrl',
    //   authRequired: true
    // })
    // .state('app.candidate.profile.availability', {
    //   url: '/Availability',
    //   templateUrl: 'hirely/candidate/profile/candidate-profile-availability.html',
    //   authRequired: true
    // })
    // .state('app.candidate.profile.experience', {
    //   url: '/Experience',
    //   templateUrl: 'hirely/candidate/profile/candidate-profile-experience.html',
    //   authRequired: true
    // })
    // .state('app.candidate.profile.personality', {
    //   url: '/Personality',
    //   templateUrl: 'hirely/candidate/profile/candidate-profile-personality.html',
    //   authRequired: true
    // })
    // .state('app.application', {
    //   url: '/:jobId/apply',
    //   templateUrl: 'hirely/application/job-application.html',
    //   controller: 'JobApplicationController'
    // })
    ;
  }
]);
