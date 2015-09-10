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
                templateProvider: function($templateCache){
                    return $templateCache.get('app/layout/master.html');
                }
            })
            .state('appFS', {
                url: "/appFS",
                abstract: true,
                templateProvider: function($templateCache){

                    return $templateCache.get('app/layout/master-fullscreen.html');
                }
            })
            .state('appFS.home', {
                url: '/home',
                parent: 'appFS',

                templateProvider: function($templateCache){
                    return $templateCache.get('app/home/home.html');
                },
                controller: 'HomeCtrl'
            })
            .state('app.login', {
                url: '/login',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/account/login.html');
                },
                controller: 'LoginCtrl'
            })
            .state('appFS.job', {
                url: '/job',
                parent: 'appFS',
                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/job/job-search.html');
                },
                controller: 'JobSearchCtrl'
            })
            .state('app.jobdetails', {
                url: '/jobdetails',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/jobdetails/jobDetails.html');
                },
                controller: 'JobCtrl'
            })
            .state('app.register', {
                url: '/register',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/account/register.html');
                },
                controller: 'RegisterCtrl'
            })
            .state('app.candidate', {
                url: '/candidate',
                abstract: true,

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate.html');
                },
                authRequired: true,
                controller: 'CandidateCtrl'
            })
            .state('app.candidate.dashboard', {
                url: '/dashboard',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/candidate-dashboard.html');
                },
                controller: 'CandidateDashboardCtrl',
                authRequired: true
            })
            .state('app.candidate.profile', {
                abstract: true,
                url: '/profile',

                templateProvider: function ($templateCache) {
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/profile/candidate-profile.html');

                },
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

                templateProvider: function($templateCache){

                    return $templateCache.get('app/candidate/profile/candidate-profile-basics.html');
                },
                controller: 'CandidateProfileBasicsCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.availability', {
                url: '/Availability',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/profile/candidate-profile-availability.html');
                },
                controller: 'CandidateProfileAvailabilityCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.experience', {
                url: '/Experience',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/profile/candidate-profile-experience.html');
                },
                // controller: 'CandidateProfileCtrl',
                authRequired: true
            })
            .state('app.candidate.profile.personality', {
                url: '/candidateProfileEducation',

                templateProvider: function($templateCache){
                    // simplified, expecting that the cache is filled
                    // there should be some checking... and async $http loading if not found
                    return $templateCache.get('app/candidate/profile/candidate-profile-education.html');
                },
                //  controller: 'CandidateProfileCtrl',
                authRequired: true
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/appFS/home');
    });
