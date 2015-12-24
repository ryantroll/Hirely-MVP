/**
 * Created by labrina.loving on 9/23/2015.
 */
(function () {
    'use strict';

    angular.module('mean.hirely.candidate').controller('CandidateProfilePersonalityCtrl', ['$scope','$state','$stateParams', 'CandidateService', CandidateProfilePersonalityCtrl ]);


    function CandidateProfilePersonalityCtrl($scope, $state,$stateParams, CandidateService) {
        var candidateService = CandidateService;
        $scope.personality = {
            results: '',
            slides: '',
            careerMatches: ''
        };
        var retrieveAssessment = function(){
            var assessmentId = $scope.personality.results.id;
            Traitify.setPublicKey("cbt6fmp5dfq4t2iqa8r28b7bp2"); // Example Public Key
            Traitify.setHost("api-sandbox.traitify.com"); // Example host url (Defaults to api.traitify.com)
            Traitify.setVersion("v1"); // Example Version
            var results = Traitify.ui.load("results", assessmentId, ".results");
            var personalityTypes = Traitify.ui.load("personalityTypes", assessmentId, ".personality-types");
            var personalityTraits = Traitify.ui.load("personalityTraits", assessmentId, ".personality-traits");

        }

        var initializeAssessment = function(){
            candidateService.createTraitifyAssessment().then(function(assessmentObj) {
                var assessment = assessmentObj;
                Traitify.setPublicKey("cbt6fmp5dfq4t2iqa8r28b7bp2"); // Example Public Key
                Traitify.setHost("api-sandbox.traitify.com"); // Example host url (Defaults to api.traitify.com)
                Traitify.setVersion("v1"); // Example Version
                var assessmentId = assessmentObj.id; // Example Assessment id

                var traitify = Traitify.ui.load(assessmentId, ".slide-deck", {
                    results: {target: ".results"},
                    personalityTypes: {target: ".personality-types"},
                    personalityTraits: {target: ".personality-traits"}
                });
                traitify.results.onInitialize(function(results){
                    candidateService.getAssessmentResults(assessmentId)
                        .then(function(resultsObj) {
                            $scope.personality.results = resultsObj;
                            candidateService.getAssessmentSlides(assessmentId)
                                .then(function(slidesObj) {
                                    $scope.personality.slides = slidesObj;
                                    candidateService.getAssessmentCareerMatches(assessmentId)
                                        .then(function(careerMatchesObj) {
                                            $scope.personality.careerMatches = careerMatchesObj;
                                            candidateService.savePersonality($scope.personality, $scope.user.userId);
                                        }, function(err) {

                                        });
                                }, function(err) {

                                });
                        }, function(err) {

                        });



                });

            }, function(err) {

            });

        }

        if($scope.profile && $scope.profile.personality){

            $scope.personality = $scope.profile.personality;
            retrieveAssessment();
        }
        else{
            initializeAssessment();
        }
    }
})()
;

