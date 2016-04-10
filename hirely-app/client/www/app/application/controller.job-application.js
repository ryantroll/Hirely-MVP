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
        .controller('JobApplicationController', ['$scope', '$stateParams', '$state', 'JobApplicationService', 'BusinessService', 'AuthService', JobApplicationController]);


    function JobApplicationController($scope, $stateParams, $state, JobApplicationService, BusinessService, AuthService) {

        /**
         * [availability this scope is the parent of availability step scope and this variaable is needed there]
         * @type {Object}
         */
        $scope.availability = {};

        $scope.destroyDirection = 0;
        $scope.blockFinished = false;
        $scope.enableNextButton = true;


        BusinessService.getBySlug($stateParams.businessSlug)
            .then(
                function (business) {
                    $scope.business = business;
                    $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);
                    $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business);
                    console.log("JA:info: Business loaded successfully");

                    if (AuthService.token.twt) {
                        JobApplicationService.isApplicationExists(AuthService.currentUserId, $scope.position._id).then(function (application) {
                            $scope.application = application;
                            if (!application) {
                                console.log("JA:info: No prior application found");
                                application = {
                                    userId: AuthService.currentUserId,
                                    positionId: $scope.position._id,
                                    prescreenAnswers: $scope.position.prescreenQuestions,
                                    status: 0
                                };
                                return JobApplicationService.create(application)
                                    .then(
                                        function (application) {
                                            console.log("JA:info: Application created");
                                            $scope.application = application;
                                        },//// save resolve
                                        function (err) {
                                            alert(err);
                                        }//// save reject
                                    );//// save().then()
                            } else {
                                console.log("JA:info: Prior application found");
                            }
                        }).then(function () {
                            initialize();
                        });
                    } else {
                        initialize();
                    }
                },
                function (err) {
                    console.log(err)
                }
            );

        $scope.$on('setEnableNextButton', function(event, args) {
            console.log("Caught enb: ");
            $scope.enableNextButton = args.newValue;
        });

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
                    controller: 'ProfilePersonalityController',
                    hasForm: true
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
                !(angular.isDefined(AuthService.currentUser.mobile) && AuthService.currentUser.mobile &&
                angular.isDefined(AuthService.currentUser.dateOfBirth) && AuthService.currentUser.dateOfBirth &&
                angular.isDefined(AuthService.currentUser.postalCode) && AuthService.currentUser.postalCode)
            ) {
                return 1;
            }

            if (!(Array.isArray(AuthService.currentUser.workExperience) && AuthService.currentUser.workExperience.length > 0)) {
                return 2;
            }

            if (!(Array.isArray(AuthService.currentUser.education) && AuthService.currentUser.education.length > 0)) {
                return 3;
            }

            if (!(Array.isArray(AuthService.currentUser.personalityExams) && AuthService.currentUser.personalityExams.length > 0)) {
                return 4;
            }

            if (!(angular.isDefined(AuthService.currentUser.availability.hoursPerWeekMin) && AuthService.currentUser.availability.hoursPerWeekMin > 0)) {
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
