/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('MasterCtrl', ['$scope', '$rootScope', '$state', '$interval', 'AuthService', MasterCtrl]);

    function MasterCtrl($scope, $rootScope, $state, $interval, authService) {

        $scope.location = {};
        $scope.currentPlace = null;
        $scope.$state = $state;


        // Session auto-logout controls
        $scope.refreshSession = authService.refreshSession;
        $scope.tokenRemainingTime = 0;
        $scope.showRefreshModal = false;
        $scope.updateTokenRemainingTime = function() {
            if ($rootScope.currentUserId) {
                $scope.tokenRemainingTime = Number($rootScope.token.exp) - Math.ceil(Date.now()/1000) - 5;

                if ($scope.tokenRemainingTime > 60 && $scope.showRefreshModal==true) {
                    $scope.showRefreshModal = false;
                    $scope.$apply();
                }

                if ($scope.tokenRemainingTime < 60) {
                    $scope.showRefreshModal = true;
                    $scope.$apply();
                }

                if ($scope.tokenRemainingTime < 0) {
                    $scope.showRefreshModal = false;
                    $scope.$apply();
                    $rootScope.$emit('TokenExpired');
                    $scope.tokenRemainingTime = 0;
                }
            }
        };
        setInterval($scope.updateTokenRemainingTime,1000);


    };
})();