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


	function PreScreenController($scope, $stateParams, multiStepFormInstance, userService, authService, $timeout, JobApplicationService) {

		$scope.dayDiff = function (d1, d2) {
			var months;
			if (isNaN(d2) || !d2) {
				d2 = new Date();
			}
			if (angular.isString(d1)) {
				d1 = new Date(d1);
			}
			if (angular.isString(d2)) {
				d2 = new Date(d2);
			}
			return Math.round((d2.getHours() - d1.getHours()) / 24)
		};

		$scope.initPrescreen = function() {

			/**
			 * bring the vaiant object to me from parent scope contoller.job-application.js
			 */
			var position = angular.copy($scope.position);


			$scope.daysUntilReapply = function () {
				if ($scope.jobApplication.application) {
					var dayDiff = $scope.dayDiff($scope.jobApplication.application.createdAt)
					var daysUntilReapply = 30 - dayDiff;
					if (daysUntilReapply < 0) {
						daysUntilReapply = 0;
					}
					return daysUntilReapply;
				} else {
					return 0;
				}
			}();

			$scope.isApplyEligible = function () {
				return $scope.daysUntilReapply == 0;
			}();

			$scope.$parent.blockFinished = !$scope.isApplyEligible;

			if (angular.isDefined($scope.jobApplication.application) && null !== $scope.jobApplication.application) {

				$scope.model = {
					prescreenAnswers: angular.copy($scope.jobApplication.application.prescreenAnswers)
				}


			}//// if application in granddaddy
			else {
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
			for (var x = 0; x < $scope.model.prescreenAnswers.length; x++) {
				delete $scope.model.prescreenAnswers[x]._id;
			}

			$timeout(function () {
				window.scrollTo(0, 0);
			});

			/**
			 * Waite for 1 sec to check the stepOnLoaded
			 * waiting time is added to prevent the undefined value for this var that happen occasionally
			 */
			$timeout(function () {
				if (!$scope.stepFourLoaded) {
					// $scope.user = angular.copy(authService.currentUser);
					$scope.stepFourLoaded = true;
				}

			}, 1000);/// $timeout
		}

		$scope.$watch('$parent.userIsSynced', function(newValue, oldValue) {
			if (newValue == true) {
				console.log("pre.$parent.userIsSynced = true;");
				$scope.initPrescreen();
			}
		});

		//// wait for destroy event to update data
		$scope.$on('$destroy', function(event){
			// Submit if submitting
			if (!$scope.$parent.destroyDirection) {
				return;
			}

			/**
			 * Make sure user is logged in before you do update
			 */
			if(authService.isUserLoggedIn()) {
				/**
				 * User is authenticated create application data
				 */

				var application = {
					userId: authService.currentUserID,
					positionId: position._id,
					status: 1, //// set status to 1
					prescreenAnswers: angular.copy($scope.model.prescreenAnswers)
				};

				JobApplicationService.create(application)
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
			}//// if isUserLoggedIn
			else{
				/**
				 * Error in isUserLoggedIn
				 */
				alert(result);
			}//// if true else

		});

	}
})();
