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
        'hirelyApp.core',
        'hirelyApp.account',
        'ngSanitize',
        'multiStepForm',
        'ngCookies'

    ])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                abstract: true,
                templateUrl: 'app/layout/master.html'
            })
            .state('app.home', {
                url: '/',
                parent: 'app',
                templateUrl: 'app/home/home.html',
                controller: 'HomeCtrl'
            })
            .state('app.user', {
                url: '/user',
                templateUrl: 'app/user/user.html',
                controller: 'UserController',
                authRequired: true
            })
            .state('app.user.profile', {
                url: '/profile',
                templateUrl: 'app/user/profile/user-profile.html',
                controller: 'UserProfileController',
                authRequired: true
            })
            .state('app.user.dashboard', {
                url: '/dashboard',
                templateUrl: 'app/user/user-dashboard.html',
                controller: 'UserDashboardController',
                authRequired: true
            })
            .state('application', {
                abstract: true,
                templateUrl: 'app/layout/application/application-master.tpl.html'
            })
            .state('application.apply', {
                url: '/:businessSlug/:locationSlug/:positionSlug/apply',
                templateUrl: 'app/application/job-application.tpl.html',
                controller: 'JobApplicationController'
            })

            .state('application.done', {
                url: '/:businessSlug/:locationSlug/:positionSlug/done',
                templateUrl: 'app/application/thank-you.tpl.html',
                controller: 'ThankYouApplicationController'
            })
            //
            // .state('application.printout', {
            //     url: '/:applicationId',
            //     templateUrl: 'app/business/candidate-details.tpl.html',
            //     controller: 'CandidateListController'
            // })

            .state('app.account', {
                abstract: true,
                templateUrl: 'app/layout/account/account-master.tpl.html',
            })
            .state('app.account.login', {
                url: '/login',
                templateUrl: 'app/account/login.tpl.html',
                controller: 'LoginController'
            })
            .state('app.account.loginWithMessage', {
                url: '/login/:message',
                templateUrl: 'app/account/login.tpl.html',
                controller: 'LoginController'
            })
            .state('app.account.register', {
                url: '/register',
                templateUrl: 'app/account/register.tpl.html',
                controller: 'RegisterController'
            })
            .state('app.job', {
                abstract: true,
                templateUrl: 'app/layout/job/job-master.tpl.html',
            })
            .state('app.job.position', {
                url: '/:businessSlug/:locationSlug/:positionSlug',
                templateUrl: 'app/job/job-position.tpl.html',
                controller: 'JobPositionController'
            })
            .state('app.business', {
                abstract: true,
                templateUrl: 'app/layout/business/business-master.tpl.html',
            })
            .state('app.business.candidateList', {
                url: '/:businessSlug/:locationSlug/:positionSlug/applicants',
                templateUrl: 'app/business/candidate-list.tpl.html',
                controller: 'CandidateListController'
            })
            .state('app.business.candidateDetails', {
                url: '/applications/:applicationId',
                templateUrl: 'app/business/candidate-details.tpl.html',
                controller: 'CandidateDetailsController'
            })


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
    });
