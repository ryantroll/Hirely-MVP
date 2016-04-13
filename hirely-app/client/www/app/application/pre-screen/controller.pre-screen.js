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

        .controller('PreScreenController', ['$scope', '$state', '$stateParams', '$timeout', 'JobApplicationService', PreScreenController]);


    function PreScreenController($scope, $state, $stateParams, $timeout, JobApplicationService) {

        $scope.daysUntilReapply = 0;

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
            return Math.round((d2.getHours() - d1.getHours()) / 24)
        };

        $scope.initPrescreen = function () {
            $scope.daysUntilReapply = $scope.getDaysUntilReapply($scope.application);
            $scope.isApplyEligible = $scope.daysUntilReapply == 0;
            $scope.$parent.blockFinished = !$scope.isApplyEligible;

            $(window).scrollTop(0);
            $scope.stepFourLoaded = true;
        };
        $timeout($scope.initPrescreen);

        $scope.getDaysUntilReapply = function (application) {
            if (application.status == 0) {
                return 0;
            }
            var dayDiff = $scope.dayDiff(application.createdAt);
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
                $scope.application.status = 1;
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
