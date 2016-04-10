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

    angular.module('hirelyApp').controller('ProfilePersonalityController', ['$scope', '$timeout', 'AuthService', 'TraitifyService', 'TRAITIFY_PUBLIC_KEY', ProfilePersonalityController]);


    function ProfilePersonalityController($scope, $timeout, AuthService, TraitifyService, TRAITIFY_PUBLIC_KEY) {

        $scope.stepThreeLoaded = false;

        $scope.resultsLoaded = false;

        var saved = false;

        var assessmentId = null;

        var traitify = null;

        var results = {};


        Traitify.setPublicKey(TRAITIFY_PUBLIC_KEY);
        Traitify.setHost("api.traitify.com");
        Traitify.setVersion("v1");

        $scope.assessment = {};

        $timeout(function () {
            $scope.$emit('setEnableNextButton', {newValue:false});
            window.scrollTo(0, 0);
        });

        /**
         * Below code is used for testing traitfiy meta data saving
         */
        // TraitifyService.getTest()
        // .then(
        //     function(test){
        //         console.log(test);
        //         assessmentId = test.extId;
        //         results.slides = test.slides;
        //         results.blend = test.personalityBlend;
        //         results.traits = test.personalityTraits;
        //         results.types = test.personalityTypes;

        //         saveAssessment();
        //     }
        // )

        function saveAssessment() {
            if (results.slides && results.types && results.blend && results.traits && assessmentId && !saved) {
                saved = true;
                TraitifyService.saveAssessment(results, AuthService.currentUserId, assessmentId).then(function (personalityExam) {
                    AuthService.currentUser.personalityExams = [personalityExam];
                });
            }
        }//// fun. saveAssessment


        /**
         * Start by checking if user taken the personality assessment before
         */
        $scope.initPersonality = function () {
            if (AuthService.currentUser.personalityExams && AuthService.currentUser.personalityExams.length) {
                $scope.stepThreeLoaded = true;
                var assessmentId = AuthService.currentUser.personalityExams[0].extId;
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
                                $scope.$emit('setEnableNextButton', {newValue:true});

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

        $scope.$on('$destroy', function (event) {
            $scope.$emit('setEnableNextButton', {newValue:true});
        })

    }
})();
