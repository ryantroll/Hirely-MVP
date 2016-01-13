/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 *
 *
 */
(function () {
	'use strict';

	angular.module('hirelyApp').controller('StepFourController', ['$scope', '$stateParams', 'multiStepFormInstance', 'UserService', 'AuthService', '$timeout', StepFourController]);


	function StepFourController($scope, $stateParams, multiStepFormInstance, UserService, AuthService, $timeout) {

		$scope.validStep = false;

		$scope.stepFourLoaded = true;  // TODO:  Handle this

		// TODO: Figure out how to map the input prescreen answers to an array like below
		$scope.prescreenAnswers = [];

		$scope.application = {};

		$scope.$watch('stepFour.$valid', function(state) {
			multiStepFormInstance.setValidity(state);
		});

		$scope.$watch('stepFour.$valid', function(state) {
			multiStepFormInstance.setValidity(state);
		});

		/**
		 * Waite for 1 sec to check the stepOnLoaded
		 * waiting time is adde dto prevent the undefined value for this var that happen occasionally
		 */
		$timeout(function(){
			if(!$scope.stepFourLoaded){
				$scope.user = angular.copy(AuthService.currentUser);
				$scope.stepFourLoaded = true;
			}
		}, 1000);/// $timeout


		//// wait for destroy event to update data
		$scope.$on('$destroy', function(event){
			/**
			 * Make sure user is logged in before you do update
			 */
			AuthService.getAuth().then(
				/**
				 * user is logged in go ahead and do data update
				 */
				function(result){
					if(true === result){
						/**
						 * User is authenticated create application data
						 */

						var application = new JobApplication(UserService.currentUser,
															 $scope.variant.id,
															 0,
															 $scope.prescreenAnswers)
						HirelyApiService.applications().post(application).then(
							function(application){
								deferred.resolve(application);
								$scope.application = application;
							},
							function(error){
								deferred.reject(error);
							}
						);

						return deferred.promise;
					}//// if getAuth
					else{
						/**
						 * Error in getAuth
						 */
						console.log(result);
						alert(result);
					}//// if true else

				},///// resolve funtion
				function(err){
					/**
					 * User is not logged id do do anything
					 */

				}//// fun. getAuth Reject
			);/// getAuth promise

		});

	}
})();
