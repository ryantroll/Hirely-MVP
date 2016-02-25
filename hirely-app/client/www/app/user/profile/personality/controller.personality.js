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

	angular.module('hirelyApp').controller('ProfilePersonalityController', ['$scope', '$stateParams', 'TraitifyService', 'AuthService', 'UserService', 'TRAITIFY_PUBLIC_KEY', ProfilePersonalityController]);


	function ProfilePersonalityController($scope, $stateParams, TraitifyService, AuthService, UserService, TRAITIFY_PUBLIC_KEY) {

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
		Traitify.setHost("api-sandbox.traitify.com");
		Traitify.setVersion("v1");

		$scope.assessment = {};



        // TraitifyService.getTest()
        // .then(
        //     function(test){
        //         console.log(test);
        //         var data = {};
        //         data.slides = test.slides;
        //         data.types = test.personalityTypes;
        //         data.traits = test.personalityTraits;
        //         data.blend = test.personalityBlend;

        //         return TraitifyService.saveAssessment(data, AuthService.currentUserID, test.extId );
        //     }
        // )

		function saveAssessment() {
			if (results.slides && results.types && results.blend && results.traits && assessmentId && !saved) {
      			saved = true;
				TraitifyService.saveAssessment(results, AuthService.currentUserID, assessmentId);
			}
		}//// fun. saveAssessment


		/**
		 * Start by checking if user taken the personality assessment before
		 */
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
    					/**
    					 * Send null to next then() function if user has no assessment
    					 */
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

    				/**
    				 * Load the result
    				 * @type {[type]}
    				 */
	    			var traitifyResults = Traitify.ui.load("results", assessmentId, ".personality-results"); // Example selector for widget target
				    traitifyResults.onInitialize(function(){
				    	$scope.traitifyResultLoaded = true;
				    	$scope.stepThreeLoaded = $scope.resultsLoaded = $scope.traitifyResultLoaded && $scope.traitifyTypesLoaded && $scope.traitifyTraitsLoaded;
				    	$scope.$apply();
				    });

				    /**
				     * Load Traitify personality types
				     */
	    			var traitifyTypes = Traitify.ui.load("personalityTypes", assessmentId, ".personality-types"); // Example selector for widget target
				    traitifyTypes.onInitialize(function(){
				    	$scope.traitifyTypesLoaded = true;
				    	$scope.stepThreeLoaded = $scope.resultsLoaded = $scope.traitifyResultLoaded && $scope.traitifyTypesLoaded && $scope.traitifyTraitsLoaded;
				    	$scope.$apply();
				    });

				    var traitifyTraits = Traitify.ui.load("personalityTraits", assessmentId, ".personality-traits"); // Example selector for widget target
				    traitifyTraits.onInitialize(function(){
				    	$scope.traitifyTraitsLoaded = true;
				    	$scope.stepThreeLoaded = $scope.resultsLoaded = $scope.traitifyResultLoaded && $scope.traitifyTypesLoaded && $scope.traitifyTraitsLoaded;
				    	$scope.$apply();
				    });

				    return null;
    			}/// if extId !== null
    			else{
    				/**
    				 * no assessment is been taken
    				 * get new assessment from traitify and move to next then()
    				 */
                    $scope.stepThreeLoaded = true;
                    return null;
    			}////
    		}//// fun.
    	)//// then()


        $scope.showAssessment = function(){

            /**
             * Disable next button
             */
            delete $scope.enableNextButton;

            TraitifyService.getAssessmentId()
            .then(
                function(data){
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
                            // $scope.stepThreeLoaded = true;
                            $scope.personalityExam = true;

                            $scope.$apply();
                        });

                        traitify.results.onInitialize(function() {
                            $scope.traitifyResultLoaded = true;
                            $scope.personalityExam = false;
                            /**
                             * Enable next button after result is displayed
                             */
                            $scope.enableNextButton = true;

                            Traitify.getPersonalityTypes(assessmentId).then(function(data) {
                                results.types = data.personality_types;
                                results.blend = data.personality_blend;
                                $scope.traitifyTypesLoaded = true;

                                saveAssessment()
                            });
                            Traitify.getPersonalityTraits(assessmentId).then(function(data) {
                                results.traits = data;
                                $scope.traitifyTraitsLoaded = true;

                                saveAssessment()
                            });
                            $scope.resultsLoaded = true;
                            $scope.$apply();
                        });
                    }/// if new-assessment
                }//// fun.
            )//// then()
        }/// fun. showAssessment

	}
})();