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

	angular.module('hirelyApp')
	.controller('PreScreenController', ['$scope', '$stateParams', 'multiStepFormInstance', 'UserService', 'AuthService', '$timeout', 'JobApplicationService', PreScreenController]);


	function PreScreenController($scope, $stateParams, multiStepFormInstance, UserService, AuthService, $timeout, JobApplicationService) {

		/**
		 * $scope.business, postion is inhereated from controller.job-application.js
		 */


		/**
		 * bring the vaiant object to me from parent scope contoller.job-application.js
		 */
		var position = angular.copy($scope.position);


		if(angular.isDefined($scope.jobApplication.application) && null !== $scope.jobApplication.application){

			$scope.model = {
				prescreenAnswers: angular.copy($scope.jobApplication.application.prescreenAnswers)
			}

		}//// if application in granddaddy
		else{
			/**
			 * initialize the data model to be saved in DB
			 * @type {Object}
			 */
			$scope.model = {
				prescreenAnswers: angular.copy(position.prescreenQuestions)
			};


		}/// if applicaiton in granddaddy else

		/**
		 * Remove the _id property from answers array, if kept and sent with post request will create problem
		 */
		for(var x=0; x<$scope.model.prescreenAnswers.length; x++){
			delete $scope.model.prescreenAnswers[x]._id;
		}



		/**
		 * Waite for 1 sec to check the stepOnLoaded
		 * waiting time is added to prevent the undefined value for this var that happen occasionally
		 */
		$timeout(function(){
			if(!$scope.stepFourLoaded){
				// $scope.user = angular.copy(AuthService.currentUser);
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

						var application = new JobApplication(
							AuthService.currentUserID,
							position._id,
							 1, //// set status to 1
							 angular.copy($scope.model.prescreenAnswers)
						);

						JobApplicationService.save(application)
						.then(
							function(savedApp){
								/**
								 * application saved
								 * Update the parent scope
								 * $scope.jobApplication.application  defined in parent controller.job-application.js
								 */
								$scope.jobApplication.application = savedApp;

							},//// save resolve
							function(err){
								alert(err);
							}//// save reject
						);//// save().then()

						// return deferred.promise;
					}//// if getAuth
					else{
						/**
						 * Error in getAuth
						 */
						alert(result);
					}//// if true else

				},///// resolve funtion
				function(err){
					/**
					 * User is not logged in don't do anything
					 */

				}//// fun. getAuth Reject
			);/// getAuth promise

		});

	}
})();
