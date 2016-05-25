/**
 *
 * Job Profiler Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
    'use strict';

    angular.module('hirelyApp').controller('ThankYouProfilerController', ['$rootScope', '$scope', '$stateParams', 'AuthService', 'BusinessService', ThankYouProfilerController]);


    function ThankYouProfilerController($rootScope, $scope, $stateParams, AuthService, BusinessService) {

        $scope.rootScopt = $rootScope;
        $scope.$stateParams = $stateParams;

        $scope.logout = function() {
            AuthService.logout();
            // console.log("Logging out and returning to survey");
            // $rootScope.nextState.push({state:$state.current.name, params:$state.params});
            // $state.go('master.application.profiler', $stateParams);
        };

        BusinessService.getBySlug($stateParams.businessSlug)
            .then(
                function (business) {
                    $scope.business = business;
                    $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);
                    $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business);
                },
                function (err) {
                    console.log(err)
                }
            );

    }
})();
