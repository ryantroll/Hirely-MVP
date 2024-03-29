'use strict';

var myApp = angular.module('hirelyApp',
    [
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.typeahead',
        'ui.grid',
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

            .state('master', {
                abstract: true,
                templateUrl: 'app/layout/master.html'
            })
            .state('master.default', {
                abstract: true,
                templateUrl: 'app/layout/default.html',
                controller: 'DefaultCtrl'
            })
            // .state('master.default.home', {
            //     url: '/',
            //     templateUrl: 'app/home/home.html',
            //     controller: 'HomeCtrl'
            // })

            .state('master.default.dashboard', {
                url: '/',
                templateUrl: 'app/user/user-dashboard.html',
                controller: 'UserDashboardController',
                authRequired: true
            })

            .state('master.default.user', {
                url: '/user',
                templateUrl: 'app/user/user.html',
                controller: 'UserController',
                authRequired: true
            })
            .state('master.default.user.profile', {
                url: '/profile',
                templateUrl: 'app/user/profile/user-profile.html',
                controller: 'UserProfileController',
                authRequired: true
            })
            .state('master.application', {
                abstract: true,
                templateUrl: 'app/layout/application/application-master.tpl.html'
            })
            .state('master.application.apply', {
                url: '/:businessSlug/:locationSlug/:positionSlug/apply',
                templateUrl: 'app/application/job-application.tpl.html',
                controller: 'JobApplicationController',
                authRequired: true
            })
            .state('master.application.profiler', {
                url: '/:businessSlug/:locationSlug/:positionSlug/survey',
                templateUrl: 'app/application/job-profiler.tpl.html',
                controller: 'JobProfilerController',
                authRequired: true
            })
            .state('master.application.applyTmp', {
                url: '/:businessSlug/:locationSlug/:positionSlug/applink.aspx',
                templateUrl: 'app/application/job-application.tpl.html',
                controller: 'JobApplicationController',
                authRequired: true
            })


            .state('master.default.confirm', {
                url: '/:businessSlug/:locationSlug/:positionSlug/done',
                templateUrl: 'app/application/thank-you.tpl.html',
                controller: 'ThankYouApplicationController',
                authRequired: false
            })
            .state('master.default.profiler-done', {
                url: '/:businessSlug/:locationSlug/:positionSlug/survey-done',
                templateUrl: 'app/application/profiler-confirm/thank-you.tpl.html',
                controller: 'ThankYouProfilerController',
                authRequired: false
            })
            //
            // .state('master.application.printout', {
            //     url: '/:applicationId',
            //     templateUrl: 'app/business/candidate-details.tpl.html',
            //     controller: 'CandidateListController'
            // })


            .state('master.default.account', {
                abstract: true,
                templateUrl: 'app/layout/account/account-master.tpl.html',
            })
            .state('master.default.account.login', {
                url: '/login',
                templateUrl: 'app/account/login.tpl.html',
                controller: 'LoginController'
            })
            .state('master.default.account.loginWithMessage', {
                url: '/login/:message',
                templateUrl: 'app/account/login.tpl.html',
                controller: 'LoginController'
            })
            .state('master.default.account.register', {
                url: '/register',
                templateUrl: 'app/account/register.tpl.html',
                controller: 'RegisterController'
            })
            .state('master.default.account.registerWithMessage', {
                url: '/register/:message',
                templateUrl: 'app/account/register.tpl.html',
                controller: 'RegisterController'
            })
            .state('master.default.account.hmInvitationBusiness', {
                url: '/:businessSlug/hm-invite',
                templateUrl: 'app/account/invite.tpl.html',
                controller: 'InviteController',
                authRequired: true
            })
            .state('master.default.account.hmInvitationLocation', {
                url: '/:businessSlug/:locationSlug/hm-invite',
                templateUrl: 'app/account/invite.tpl.html',
                controller: 'InviteController',
                authRequired: true
            })
            .state('master.default.account.hmInvitationPosition', {
                url: '/:businessSlug/:locationSlug/:positionSlug/hm-invite',
                templateUrl: 'app/account/invite.tpl.html',
                controller: 'InviteController',
                authRequired: true
            })
            .state('master.default.account.hmInvitationDemo', {
                url: '/hm-invite',
                templateUrl: 'app/account/invite.tpl.html',
                controller: 'InviteController',
                authRequired: true
            })


            .state('master.default.job', {
                abstract: true,
                templateUrl: 'app/layout/job/job-master.tpl.html',
            })
            .state('master.default.job.business', {
                url: '/:businessSlug',
                templateUrl: 'app/job/job-business.tpl.html',
                controller: 'JobBusinessController'
            })
            .state('master.default.job.position', {
                url: '/:businessSlug/:locationSlug/:positionSlug',
                templateUrl: 'app/job/job-position.tpl.html',
                controller: 'JobPositionController'
            })
            .state('master.default.business', {
                abstract: true,
                templateUrl: 'app/layout/business/business-master.tpl.html',
            })
            .state('master.default.business.candidateList', {
                url: '/:businessSlug/:locationSlug/:positionSlug/applicants',
                templateUrl: 'app/business/candidate-list.tpl.html',
                controller: 'CandidateListController',
                authRequired: true
            })
            .state('master.default.business.candidateDetails', {
                url: '/applications/:applicationId',
                templateUrl: 'app/business/candidate-details.tpl.html',
                controller: 'CandidateDetailsController',
                authRequired: true
            })


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');
    });
