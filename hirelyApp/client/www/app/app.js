'use strict';

var myApp = angular.module('hirelyApp',
    [   
        'uiGmapgoogle-maps',
        'ui.router',
        'ui.bootstrap',
        'ui.grid',
        'uiGmapgoogle-maps',
        'firebase',
        'ngMask',
        'ng-currency',
        'tc.chartjs',
        'rzModule',
        'angular-flexslider',
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
                templateUrl: 'app/layout/master.html'
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
                url: '/job?placeId&distance&occupationId&wage',
                parent: 'app',
                templateUrl: 'app/job/job-search.html',
            })
            .state('app.jobdetails', {
                url: '/jobdetails?siteId&positionId&placeId',
                templateUrl: 'app/jobdetails/jobDetails.html',
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
                templateUrl: 'app/candidate/profile/candidate-profile.html',
                controller: 'CandidateProfileCtrl',
                authRequired: true,
                resolve: {
                    profile: function ($q, CandidateService, UserService) {
                        //retrieve profile before loading
                        var user = UserService.getCurrentUser();
                        return CandidateService.getProfile(user.providerId).then(function(profile) {

                           return profile;
                        }, function(err) {
                            deferred.reject(err);
                        });

                    }
                }
            })
            .state('app.candidate.profile.basics', {
                url: '/basics',
                templateUrl: 'app/candidate/profile/candidate-profile-basics.html',

                controller: 'CandidateProfileBasicsCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.availability', {
                url: '/Availability',
                templateUrl: 'app/candidate/profile/candidate-profile-availability.html',
                controller: 'CandidateProfileAvailabilityCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.experience', {
                url: '/Experience',
                templateUrl: 'app/candidate/profile/candidate-profile-experience.html',
                authRequired: true
            })
            .state('app.candidate.profile.personality', {
                url: '/candidateProfileEducation',
                templateUrl: 'app/candidate/profile/candidate-profile-personality.html',
                authRequired: true
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });
