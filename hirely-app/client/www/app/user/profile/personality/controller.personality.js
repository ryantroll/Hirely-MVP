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

    angular.module('hirelyApp').controller('ProfilePersonalityController', ['$scope', '$timeout', 'AuthService', 'TraitifyService', 'TRAITIFY_PUBLIC_KEY', '$uibModal', ProfilePersonalityController]);

    function ProfilePersonalityController($scope, $timeout, AuthService, TraitifyService, TRAITIFY_PUBLIC_KEY, $uibModal) {

        $scope.stepThreeLoaded = false;

        $scope.resultsLoaded = false;

        $scope.showInstructions = false;

        $scope.instructions = 'This is a quick personality exam.  Simply click "Me" or "Not Me" as each image relates to you. Remember that this assessment is designed for your work life, so respond to each image based on your work preferences.';

        var saved = false;

        var assessmentId = null;

        var traitify = null;

        var results = {};

        var modalInstance;





        Traitify.setPublicKey(TRAITIFY_PUBLIC_KEY);
        Traitify.setHost("api.traitify.com");
        Traitify.setVersion("v1");

        $scope.assessment = {};

        $timeout(function () {
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
                $scope.$emit('setEnableNextButton', {newValue:true});

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

                $scope.status = {isFirstOpen:true, isSecondOpen:false, isThirdOpen:false};

                $(window).scrollTop(0);

            } else {

                // $(window).scrollTop(0);
                $scope.showAssessment();
                $scope.$emit('setEnableNextButton', {newValue:false});
                $scope.stepThreeLoaded = true;
            }
        };
        $timeout($scope.initPersonality);



        $scope.showAssessment = function () {
            // $("header").hide();
            // $("footer").hide();
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

                                $scope.showInstructionsModal();
                            });

                            traitify.results.onInitialize(function () {
                                $scope.traitifyResultLoaded = true;
                                $scope.personalityExam = false;

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
                                $scope.status = {isFirstOpen:true};
                                $("header").show();
                                $("footer").show();
                                $scope.$emit('setEnableNextButton', {newValue:true});
                                $scope.$apply();
                            });
                        }/// if new-assessment
                    }//// fun.
                )//// then()
        }/// fun. showAssessment

        $scope.showInstructionsModal = function(){
            modalInstance = $uibModal.open({
                size: 'sm',
                template:'<div style="padding:20px" class="personality-instructions-modal"><a href="javascript:void(0)" class="close" ng-click="closeModal()"><i class="icon glyphicon glyphicon-remove"></i></a><h4>Instructions</h4><p>' + $scope.instructions + '</p></div>',
                scope:$scope,
                backdrop:true
            });
            $timeout(function() {
                $(".modal-content").css("top", getBody().clientHeight/2-140);
            });
        }

        $scope.closeModal = function(){
            if(angular.isDefined(modalInstance)){
                modalInstance.close();
                modalInstance = undefined;
            }
        }

        $scope.$on('$destroy', function (event) {
            $scope.$emit('setEnableNextButton', {newValue:true});
        });

        $scope.toggleInstructions = function(){
            var handleMenuClick = function (e) {
                if (true === $scope.showInstructions) {
                    $scope.showInstructions = false;
                    $scope.$apply();
                    //// unbind when menu closed no need to check for click
                    $('body').unbind('click', handleMenuClick);
                }
                else {

                    $scope.showInstructions = true;
                    $scope.$apply();
                }
            };
            /**
             * the event will bubble up to body so do the work on body click \ only if menu is closed
             * this to make sure the menu is closed when click outside the menu
             */
            if (false === $scope.showInstructions) {
                $('body').bind('click', handleMenuClick);
            }
        }

    }
})();
