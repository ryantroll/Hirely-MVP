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
        .controller('JobApplicationController', ['$scope', '$rootScope', '$stateParams', '$state', 'JobApplicationService', 'BusinessService', JobApplicationController]);


    function JobApplicationController($scope, $rootScope, $stateParams, $state, JobApplicationService, BusinessService) {

        /**
         * [availability this scope is the parent of availability step scope and this variaable is needed there]
         * @type {Object}
         */
        $scope.availability = {};

        $scope.destroyDirection = 0;
        $scope.blockFinished = false;


        BusinessService.getBySlug($stateParams.businessSlug)
            .then(
                function (business) {
                    $scope.business = business;
                    $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);
                    $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business);
                    console.log("JA:info: Business loaded successfully");

                    JobApplicationService.isApplicationExists($rootScope.currentUserId, $scope.position._id).then(function(application) {
                        $scope.application = application;
                        if (!application) {
                            console.log("JA:info: No prior application found");
                            application = {
                                userId: $rootScope.currentUserId,
                                positionId: $scope.position._id,
                                prescreenAnswers: $scope.position.prescreenQuestions,
                                status: 0
                            };
                            return JobApplicationService.create(application)
                                .then(
                                    function(application){
                                        console.log("JA:info: Application created");
                                        $scope.application = application;
                                    },//// save resolve
                                    function(err){
                                        alert(err);
                                    }//// save reject
                                );//// save().then()
                        } else {
                            console.log("JA:info: Prior application found");
                        }
                    }).then(function() {
                        initialize();
                    });
                },
                function (err) {
                    console.log(err)
                }
            );

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

            if (!(Array.isArray($rootScope.currentUser.workExperience) && $rootScope.currentUser.workExperience.length > 0)) {
                return 2;
            }

            if (!(Array.isArray($rootScope.currentUser.education) && $rootScope.currentUser.education.length > 0)) {
                return 3;
            }

            if (!(Array.isArray($rootScope.currentUser.personalityExams) && $rootScope.currentUser.personalityExams.length > 0)) {
                return 4;
            }

            if (!(angular.isDefined($rootScope.currentUser.availability.hoursPerWeekMin) && $rootScope.currentUser.availability.hoursPerWeekMin > 0)) {
                return 5;
            }

            return 6;
        };

        /**
         * [finish trigger when user get to the last step pre-screen and click finish button, will reidrect the user to thank you page]
         * @return {[type]} [description]
         */
        $scope.finish = function () {
            delete $scope.layoutModel.noHeader;
            $state.go('master.default.confirm', {businessSlug: $scope.business.slug, locationSlug: $scope.location.slug, positionSlug: $scope.position.slug});
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
