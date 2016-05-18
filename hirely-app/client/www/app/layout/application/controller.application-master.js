/**
 * Created by Iyad Bitar on 11/02/2016.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout')
        .directive("applicationFooter", function () {
            return {
                restrict: 'A',
                templateUrl: 'app/layout/application/application-footer.tpl.html',
                scope: true,
                transclude: false
            };
        })
        .directive("applicationHeader", function () {
            return {
                restrict: 'A',
                templateUrl: 'app/layout/application/application-header.tpl.html',
                controller: 'ApplicationHeaderController',
                scope: true,
                transclude: false
            };
        })
        .controller('ApplicationMasterController', ['$scope', ApplicationMasterController])

    function ApplicationMasterController($scope) {
        $scope.layoutModel = {business: null, noHeader: null};

        $scope.profiling = false;
        if (window.location.href.indexOf("profiler")!==-1) {
            $scope.profiling = true;
        }



    };
})();