/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('DefaultCtrl', ['$scope', '$rootScope', '$state', DefaultCtrl]);

    function DefaultCtrl($scope, $rootScope, $state) {
        $scope.rootScope = $rootScope;
    };
})();