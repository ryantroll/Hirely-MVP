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
        .directive('validateQuestion', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, ele, attrs, ctrl) {
                    ctrl.$validators.validateQuestion = function(modelValue, viewValue) {
                        if (!viewValue) {
                            return false;
                        }
                        return viewValue.length > 3;
                    };/// unshift
                }//// fun. link
            }/// return object
        })/// validate question is not empty;

        .controller('PreScreenController', ['$scope', '$state', '$stateParams', '$timeout', 'AuthService', 'JobApplicationService', PreScreenController]);


    function PreScreenController($scope, $state, $stateParams, $timeout, AuthService, JobApplicationService) {

        $scope.daysUntilReapply = 0;

        $scope.initPrescreen = function () {
            $scope.daysUntilReapply = $scope.getDaysUntilReapply($scope.application);
            $scope.isApplyEligible = $scope.daysUntilReapply == 0;
            $scope.$parent.blockFinished = !$scope.isApplyEligible;

            $(window).scrollTop(0);
            $scope.stepFourLoaded = true;
        };
        $timeout($scope.initPrescreen);

        $scope.dayDiff = function (d1, d2) {
            if (isNaN(d2) || !d2) {
                d2 = new Date();
            }
            if (angular.isString(d1)) {
                d1 = new Date(d1);
            }
            if (angular.isString(d2)) {
                d2 = new Date(d2);
            }

            var one_day=1000*60*60*24; // one day in milliseconds
            return Math.round((d2.getTime() - d1.getTime()) / one_day);
        };

        $scope.getDaysUntilReapply = function (application) {
            if (application.status<=0 || !application.appliedAt) {
                return 0;
            }
            var dayDiff = $scope.dayDiff(application.appliedAt);
            var daysUntilReapply = 30 - dayDiff;
            if (daysUntilReapply < 0) {
                daysUntilReapply = 0;
            }
            return daysUntilReapply;
        };

        $scope.gotoPosition = function () {
            $state.go('master.default.job.position', $stateParams);
        };

        //// wait for destroy event to update data
        $scope.$on('$destroy', function (event) {

            // If "Finish" was clicked, update the status of the application
            if ($scope.destroyDirection) {
                console.log("'Submit' was clicked, update the status of the application");

                // Create history entry
                var historyEntry = {
                    time: new Date(),
                    type: 'StatusChange',
                    subject: "Status changed from "+JobApplicationService.statusLabels[$scope.application.status+1]+" to "+JobApplicationService.statusLabels[1+1],
                    body: "Status changed from "+JobApplicationService.statusLabels[$scope.application.status+1]+" to "+JobApplicationService.statusLabels[1+1],
                    meta: {
                        fromStatus: $scope.application.status,
                        toStatus: 1
                    },
                    userId: AuthService.currentUserId,
                    userFirstName: AuthService.currentUser.firstName,
                    userLastName: AuthService.currentUser.lastName
                };

                if (!$scope.application.history || !$scope.application.history.length) {
                    $scope.application.history = [];
                }
                $scope.application.history.push(historyEntry);

                $scope.application.status = 1;
                $scope.application.appliedDate = new Date();
                
            }

            JobApplicationService.save($scope.application)
                .then(
                    function () {
                        console.log("Application created");
                    },//// save resolve
                    function (err) {
                        alert(err);
                    }//// save reject
                );//// save().then()
        });

    }
})();
