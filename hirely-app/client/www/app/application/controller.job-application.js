/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
    'use strict';

    angular.module('hirelyApp')
        .filter('numberRound', function () {
            return function (value) {
                return Math.round(value);
            }
        })
        .controller('JobApplicationController', ['$q', '$scope', '$rootScope', '$stateParams', '$state', '$timeout', 'JobApplicationService', 'BusinessService', JobApplicationController]);


    function JobApplicationController($q, $scope, $rootScope, $stateParams, $state, $timeout, JobApplicationService, BusinessService) {

        /**
         * [availability this scope is the parent of availability step scope and this variaable is needed there]
         * @type {Object}
         */
        $scope.availability = {};

        $scope.destroyDirection = 0;
        $scope.blockFinished = false;
        

        /**
         * [jobApplication a parent object to hold variables to be set by child scope
         * if child scope set direct variable of scope the will be overwriten]
         * @type {Object}
         */
        $scope.jobApplication = {
            application: null, //// applicatin object after it get saved in db
            isNewUser: false //// this variable will be set in register form controller or login form congroller to identify new user from old logged in user
        };


        BusinessService.getBySlug($stateParams.businessSlug)
            .then(
                function (business) {

                    $scope.business = business;
                    $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);

                    $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business)

                    initialize();
                },
                function (err) {
                    console.log(err)
                }
            );

        /**
         * [getApplicationData this function created to separate the promise chain,
         * if user not logged in there is not need to load application data and user profile fileds
         * this function will be called again inside UserLoggedIn event below to continue data loading]
         * @return {promise} [description]
         */
        function getApplicationData() {
            return JobApplicationService.getById($scope.position._id)
                .then(
                    function (app) {
                        if (app) {
                            $scope.jobApplication.application = app;
                        }
                    }
                )

        }//// fun. getApplicationData

        function setSteps() {

            $scope.steps = [

                {
                    templateUrl: '/app/user/profile/basic/basic.tpl.html',
                    controller: 'ProfileBasicController',
                    hasForm: false
                },
                {
                    templateUrl: '/app/user/profile/experience/experience.tpl.html',
                    controller: 'ProfileExperienceController',
                    hasForm: false
                },
                {
                    templateUrl: '/app/user/profile/education/education.tpl.html',
                    controller: 'ProfileEducationController',
                    hasForm: false
                },
                {
                    templateUrl: '/app/user/profile/personality/personality.tpl.html',
                    controller: 'ProfilePersonalityController'
                },
                {
                    templateUrl: '/app/user/profile/availability/availability.tpl.html',
                    controller: 'ProfileAvailabilityController',
                    hasForm: true
                },
                {
                    templateUrl: '/app/application/pre-screen/pre-screen.tpl.html',
                    controller: 'PreScreenController',
                    hasForm: true
                }
            ];
        }//// fun. setStpes

        function initialize() {

            setSteps();

            /**
             * initiate layout template variables
             */
            $scope.dataError = !$scope.business || !$scope.location || !$scope.position;
            $scope.dataLoaded = true;
            $scope.registerFrom = true;
            $scope.loginForm = false;
            $scope.passwordForm = false;

            if (!$scope.dataError) {
                /**
                 * Set required variable in parent $scope app/layout/application-master.js
                 * @type {[type]}
                 */
                $scope.layoutModel.business = $scope.business.name;
                $scope.layoutModel.position = $scope.position.title;
                $scope.layoutModel.location = $scope.location.name;

                $scope.layoutModel.noHeader = true;
            }//// if!dataError

        }//// fun. initialize

        /**
         * [setInitialStep used inside the template in multiStepForm directive
         * to set the initiale step based on user profile]
         */
        $scope.setInitialStep = function () {
            // var initialStep = 1;
            if (
                !(angular.isDefined($rootScope.currentUser.mobile) && $rootScope.currentUser.mobile &&
                angular.isDefined($rootScope.currentUser.dateOfBirth) && $rootScope.currentUser.dateOfBirth &&
                angular.isDefined($rootScope.currentUser.postalCode) && $rootScope.currentUser.postalCode)
            ) {
                return 1;
            }

            if (!(angular.isDefined($scope.userData) && Array.isArray($scope.userData.workExperience) && $scope.userData.workExperience.length > 0)) {
                return 2;
            }

            if (!(angular.isDefined($scope.userData) && Array.isArray($scope.userData.education) && $scope.userData.education.length > 0)) {
                return 3;
            }

            if (!(angular.isDefined($scope.userData) && Array.isArray($scope.userData.personalityExams) && $scope.userData.personalityExams.length > 0)) {
                return 4;
            }

            if (!(angular.isDefined($scope.userData.availability.hoursPerWeekMin) && $scope.userData.availability.hoursPerWeekMin > 0)) {
                return 5;
            }

            return 6;
        }

        /**
         * [finish trigger when user get to the last step pre-screen and click finish button, will reidrect the user to thank you page]
         * @return {[type]} [description]
         */
        $scope.finish = function () {
            delete $scope.layoutModel.noHeader;
            $state.go('master.application.done', {businessSlug: $scope.business.slug, locationSlug: $scope.location.slug, positionSlug: $scope.position.slug});
        };

        function semiFixedFooter() {
            var windowHeight = getBody().clientHeight;
            var docHeight = $("body > .ng-scope").height();

            if (windowHeight > docHeight) {
                $(".multi-step-container footer").addClass("fixedBottom");
            } else {
                $(".multi-step-container footer").removeClass("fixedBottom");
            }
        }

        setInterval(semiFixedFooter, 100);

        var loadingBarLocation = 0;
        setInterval(function () {
            loadingBarLocation = (loadingBarLocation + 1) % 5;
            $(".loadingBar div").css("margin-left", loadingBarLocation * 20 + "%");
        }, 300);

    }
})();
