/**
 *
 * Job Application Workflow
 *
 * Develoopers - Hirely 2015
 *
 *
 */
(function () {
    'use strict';

    angular.module('hirelyApp').controller('ProfilePersonalityController', ['$rootScope', '$scope', '$timeout', 'TraitifyService', 'TRAITIFY_PUBLIC_KEY', ProfilePersonalityController]);


    function ProfilePersonalityController($rootScope, $scope, $timeout, TraitifyService, TRAITIFY_PUBLIC_KEY) {

        $scope.stepThreeLoaded = false;

        $scope.resultsLoaded = false;

        var saved = false;

        var assessmentId = null;

        var traitify = null;

        var results = {};

        /**
         * Enable next button but default
         * it will be disabled only when user is taking the test
         */
        $scope.enableNextButton = true;


        Traitify.setPublicKey(TRAITIFY_PUBLIC_KEY);
        Traitify.setHost("api.traitify.com");
        Traitify.setVersion("v1");

        $scope.assessment = {};

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        function saveAssessment() {
            if (results.slides && results.types && results.blend && results.traits && assessmentId && !saved) {
                saved = true;
                TraitifyService.saveAssessment(results, $rootScope.currentUserId, assessmentId).then(function (personalityExam) {
                    $rootScope.currentUser.personalityExams = [personalityExam];
                });
            }
        }//// fun. saveAssessment


        /**
         * Start by checking if user taken the personality assessment before
         */
        $scope.initPersonality = function () {
            if ($rootScope.currentUser.personalityExams && $rootScope.currentUser.personalityExams.length) {
                $scope.stepThreeLoaded = true;
                var assessmentId = $rootScope.currentUser.personalityExams[0].extId;
                $scope.assessmentId = assessmentId;
                /**
                 * Load the result
                 * @type {[type]}
                 */
                var traitifyResults = Traitify.ui.load("results", assessmentId, ".personality-results"); // Example selector for widget target
                traitifyResults.onInitialize(function () {
                    $scope.traitifyResultLoaded = true;
                    $scope.stepThreeLoaded = $scope.resultsLoaded = $scope.traitifyResultLoaded && $scope.traitifyTypesLoaded && $scope.traitifyTraitsLoaded;
                    $scope.$apply();
                });

                /**
                 * Load Traitify personality types
                 */
                var traitifyTypes = Traitify.ui.load("personalityTypes", assessmentId, ".personality-types"); // Example selector for widget target
                traitifyTypes.onInitialize(function () {
                    $scope.traitifyTypesLoaded = true;
                    $scope.stepThreeLoaded = $scope.resultsLoaded = $scope.traitifyResultLoaded && $scope.traitifyTypesLoaded && $scope.traitifyTraitsLoaded;
                    $scope.$apply();
                });

                var traitifyTraits = Traitify.ui.load("personalityTraits", assessmentId, ".personality-traits"); // Example selector for widget target
                traitifyTraits.onInitialize(function () {
                    $scope.traitifyTraitsLoaded = true;
                    $scope.stepThreeLoaded = $scope.resultsLoaded = $scope.traitifyResultLoaded && $scope.traitifyTypesLoaded && $scope.traitifyTraitsLoaded;
                    $scope.$apply();
                });

                $(window).scrollTop(0);

            } else {
                $(window).scrollTop(0);
                $scope.stepThreeLoaded = true;
            }
        };
        $timeout($scope.initPersonality);


        $scope.showAssessment = function () {

            /**
             * Disable next button
             */
            delete $scope.enableNextButton;

            $("header").hide();
            $("footer").hide();
            $(window).scrollTop(0);

            TraitifyService.getAssessmentId()
                .then(
                    function (data) {
                        if (data) {
                            assessmentId = data.id;
                            $scope.assessmentId = assessmentId;

                            traitify = Traitify.ui.load(assessmentId, ".personality-analysis", {
                                results: {
                                    target: ".personality-results"
                                },
                                personalityTypes: {
                                    target: ".personality-types"
                                },
                                personalityTraits: {
                                    target: ".personality-traits"
                                }
                            });

                            traitify.slideDeck.onInitialize(function () {
                                results.slides = traitify.slideDeck.data.get("Slides");
                                // $scope.stepThreeLoaded = true;
                                $scope.personalityExam = true;

                                $scope.$apply();
                            });

                            traitify.results.onInitialize(function () {
                                $scope.traitifyResultLoaded = true;
                                $scope.personalityExam = false;
                                /**
                                 * Enable next button after result is displayed
                                 */
                                $scope.enableNextButton = true;

                                Traitify.getPersonalityTypes(assessmentId).then(function (data) {
                                    results.types = data.personality_types;
                                    results.blend = data.personality_blend;
                                    $scope.traitifyTypesLoaded = true;

                                    saveAssessment()
                                });
                                Traitify.getPersonalityTraits(assessmentId).then(function (data) {
                                    results.traits = data;
                                    $scope.traitifyTraitsLoaded = true;

                                    saveAssessment()
                                });
                                $scope.resultsLoaded = true;
                                $("header").show();
                                $("footer").show();
                                $scope.$apply();
                            });
                        }/// if new-assessment
                    }//// fun.
                )//// then()
        }/// fun. showAssessment

    }
})();
