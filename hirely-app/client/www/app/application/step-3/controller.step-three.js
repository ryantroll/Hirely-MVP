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

	angular.module('hirelyApp').controller('StepThreeController', ['$scope', '$stateParams', 'TraitifyService', 'AuthService', 'TRAITIFY_PUBLIC_KEY', StepThreeController]);


	function StepThreeController($scope, $stateParams, TraitifyService, AuthService, TRAITIFY_PUBLIC_KEY) {

		$scope.stepThreeLoaded = false;

		$scope.resultsLoaded = false;

		var saved = false;

    var assessmentId = null;

		Traitify.setPublicKey(TRAITIFY_PUBLIC_KEY);
		Traitify.setHost("api-sandbox.traitify.com");
		Traitify.setVersion("v1");

		TraitifyService.getAssessmentId().then(function(data) {
			assessmentId = data.id;
			var traitify = null;

			var results = {};
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
				console.log("Results");
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

			function saveAssessment() {
				if (results.slides && results.types && results.blend && results.traits && assessmentId && !saved) {
          saved = true;
					TraitifyService.saveAssessment(results, AuthService.currentUserID, assessmentId);
				}
			}

		});
	}
})();
