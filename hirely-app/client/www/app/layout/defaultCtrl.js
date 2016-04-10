/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('DefaultCtrl', ['$scope', '$state', 'AuthService', DefaultCtrl]);

    function DefaultCtrl($scope, $state, AuthService) {
        $scope.AuthService = AuthService;
        $scope.$state = $state;
    };
})();