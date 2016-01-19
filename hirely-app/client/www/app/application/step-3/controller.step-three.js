/**
 *
 * Job Application Workflow
 *
 * Develoopers - Hirely 2015
 *
 *
 */
(function() {
	'use strict';

	angular.module('hirelyApp').controller('StepThreeController', ['$scope', '$stateParams', 'TraitifyService', 'AuthService', 'UserService', 'TRAITIFY_PUBLIC_KEY', StepThreeController]);


	function StepThreeController($scope, $stateParams, TraitifyService, AuthService, UserService, TRAITIFY_PUBLIC_KEY) {

		$scope.stepThreeLoaded = false;

		$scope.resultsLoaded = false;

		var saved = false;

    	var assessmentId = null;

    	var traitify = null;

		var results = {};

    	Traitify.setPublicKey(TRAITIFY_PUBLIC_KEY);
		Traitify.setHost("api-sandbox.traitify.com");
		Traitify.setVersion("v1");

		$scope.assessment = {};

		function saveAssessment() {
			if (results.slides && results.types && results.blend && results.traits && assessmentId && !saved) {
      			saved = true;
				TraitifyService.saveAssessment(results, AuthService.currentUserID, assessmentId);
			}
		}//// fun. saveAssessment

    	UserService.getUserCompleteFields(AuthService.currentUserID, ['personalityExams'])
    	.then(
    		function(founded){
    			if(founded){
    				if(Array.isArray(founded.personalityExams) && founded.personalityExams.length > 0){
    					/**
    					 * user is taken the exam before
    					 */
    					return founded.personalityExams[0].extId;
    				}
    				else{
    					return null;
    				}
    			}
    		}
    	)////// getUserCompleteFields
    	.then(
    		function(extId){
    			if(null !== extId){
    				/**
    				 * Show result wedget
    				 */
    				assessmentId = extId;

	    			var traitifyResults = Traitify.ui.load("results", assessmentId, ".personality-results"); // Example selector for widget target
				    traitifyResults.onInitialize(function(){
				    	$scope.stepThreeLoaded = true;
				    	$scope.resultsLoaded = true;
				    	$scope.$apply();
				    });

	    			var traitifyTypes = Traitify.ui.load("personalityTypes", assessmentId, ".personality-types"); // Example selector for widget target
				    traitifyTypes.onInitialize(function(){
				    	$scope.stepThreeLoaded = true;
				    	$scope.resultsLoaded = true;
				    	$scope.$apply();
				    });

				    var traitifyTraits = Traitify.ui.load("personalityTraits", assessmentId, ".personality-traits"); // Example selector for widget target
				    traitifyTraits.onInitialize(function(){
				    	$scope.stepThreeLoaded = true;
				    	$scope.resultsLoaded = true;
				    	$scope.$apply();
				    });

				    return null;
    			}/// if extId !== null
    			else{
    				/**
    				 * no assessment is been taken
    				 * move to next
    				 */
    				return TraitifyService.getAssessmentId();
    			}////
    		}//// fun.
    	)//// then()
		.then(
			function(data){
				console.log(data);
				if(data){
					assessmentId = data.id;

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

					traitify.slideDeck.onInitialize(function() {
						results.slides = traitify.slideDeck.data.get("Slides");
						$scope.stepThreeLoaded = true;
						$scope.$apply();
					});

					traitify.results.onInitialize(function() {

						Traitify.getPersonalityTypes(assessmentId).then(function(data) {
							results.types = data.personality_types;
							results.blend = data.personality_blend;
							saveAssessment()
						});
						Traitify.getPersonalityTraits(assessmentId).then(function(data) {
							results.traits = data;
							saveAssessment()
						});
						$scope.resultsLoaded = true;
						$scope.$apply();
					});
				}/// if new-assessment
			}//// fun.
		)//// then()




		// TraitifyService.getTest().then(
		// 	function(obj){
		// 		$scope.assessment = obj;
		// 	},
		// 	function(err){

		// 	}

		// );//// then()

		// $scope.$on('$destroy', function(event){
		// 	TraitifyService.saveAssessment($scope.assessment, AuthService.currentUserID, $scope.assessment.extId);
		// });

		// // TraitifyService.getAssessmentId().then(function(data) {
		// // 	assessmentId = data.id;
		// // 	var traitify = null;

		// // 	var results = {};
		// // 	traitify = Traitify.ui.load(assessmentId, ".personality-analysis", {
		// // 		results: {
		// // 			target: ".personality-results"
		// // 		},
		// // 		personalityTypes: {
		// // 			target: ".personality-types"
		// // 		},
		// // 		personalityTraits: {
		// // 			target: ".personality-traits"
		// // 		}
		// // 	});

		// // 	traitify.slideDeck.onInitialize(function() {
		// // 		results.slides = traitify.slideDeck.data.get("Slides");
		// // 		$scope.stepThreeLoaded = true;
		// // 		$scope.$apply();
		// // 	});

		// // 	traitify.results.onInitialize(function() {

		// // 		Traitify.getPersonalityTypes(assessmentId).then(function(data) {
		// // 			results.types = data.personality_types;
		// // 			results.blend = data.personality_blend;
		// // 			saveAssessment()
		// // 		});
		// // 		Traitify.getPersonalityTraits(assessmentId).then(function(data) {
		// // 			results.traits = data;
		// // 			saveAssessment()
		// // 		});
		// // 		$scope.resultsLoaded = true;
		// // 		$scope.$apply();
		// // 	});




		// });//// then
	}
})();
