/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('MasterCtrl', ['$scope', '$state', 'AuthService', MasterCtrl]);

    function MasterCtrl($scope, $state, AuthService) {

        $scope.location = {};
        $scope.currentPlace = null;
        $scope.$state = $state;


        // Session auto-logout controls
        $scope.refreshSession = AuthService.refreshSession;
        $scope.tokenRemainingTime = AuthService.token.remainingTime;
    };
})();