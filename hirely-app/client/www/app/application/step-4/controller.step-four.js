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

		//$scope.application = {
		//	userId: $scope.user,
		//	status: 0,
		//}
		//$scope.prescreenAnswers = [
		//	{
		//		question: "what's up?",
		//		answer: "Nothing",
		//	}
		//]

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
						 * User is authenticated update user data
						 */
						UserService.saveUser($scope.user, AuthService.currentUserID)
							.then(
								function(savedUser){
									/**
									 * User data updated successfully
									 */

										//// make sure the AuthService data is synced
									AuthService.updateCurrentUser($scope.user);
								},//// fun. resolve
								function(err){
									/**
									 * Error in updateing user data
									 */

									alert('Error!\nSomething wrong happened while saving data.');
								}//// fun. reject
							);//// saveUser then
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
