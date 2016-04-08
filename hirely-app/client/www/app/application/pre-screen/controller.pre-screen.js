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
        .controller('PreScreenController', ['$rootScope', '$scope', '$timeout', 'JobApplicationService', PreScreenController]);


    function PreScreenController($rootScope, $scope, $timeout, JobApplicationService) {

        $scope.daysUntilReapply = 0;

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

        //// wait for destroy event to update data
        $scope.$on('$destroy', function (event) {

            // If "Finish" was clicked, update the status of the application
            if ($scope.$parent.destroyDirection) {
                console.log("'Sumbit' was clicked, update the status of the application");
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
