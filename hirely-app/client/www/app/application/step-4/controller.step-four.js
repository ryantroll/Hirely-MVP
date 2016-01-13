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
	.controller('StepFourController', ['$scope', '$stateParams', 'multiStepFormInstance', 'UserService', 'AuthService', '$timeout', 'JobApplicationService', StepFourController]);


	function StepFourController($scope, $stateParams, multiStepFormInstance, UserService, AuthService, $timeout, JobApplicationService) {

		/**
		 * vaiant to hold the vaiant object
		 * this is out of scope as it is only for reading
		 */
		var variant;

		// /**
		//  * Wait for daddy scope to finish loading data and then start initalize                                 [description]
		//  */
		// var eventUnbinder = $scope.$on('data-loaded', function(){
		// 	/**
		// 	 * Remove listener
		// 	 */
		// 	eventUnbinder();
		// });/// $on

		/**
		 * bring the vaiant object to me from grandfather
		 */
		variant = angular.copy($scope.$parent.$parent.variant);


		if(angular.isDefined($scope.$parent.$parent.application) && null !== $scope.$parent.$parent.application){

			$scope.model = {
				prescreenAnswers: angular.copy($scope.$parent.$parent.application.prescreenAnswers)
			}

		}//// if application in granddaddy
		else{
			/**
			 * initialize the data model to be saved in DB
			 * @type {Object}
			 */
			$scope.model = {
				prescreenAnswers: angular.copy(variant.prescreenQuestions)
			};
			/**
			 * Remove the _id property from answers array, if kept and sent with post request will create problem
			 */
			for(var x=0; x<$scope.model.prescreenAnswers.length; x++){
				delete $scope.model.prescreenAnswers[x]._id;
			}
		}/// if applicaiton in granddaddy else



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

		/**
		 * [grandParent to reference the grand parent in destroy event below
		 * it seems it get removed before destory event triggered]
		 */
		var grandParent = $scope.$parent.$parent;

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
							variant._id,
							 1, //// set status to 1
							 angular.copy($scope.model.prescreenAnswers)
						);

						JobApplicationService.save(application)
						.then(
							function(savedApp){
								/**
								 * application saved
								 * Update the the grandparent scope
								 */
								grandParent.application = savedApp;
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
