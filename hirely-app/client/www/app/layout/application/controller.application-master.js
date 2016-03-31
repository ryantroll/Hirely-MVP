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
        .controller('ApplicationMasterController', ['$stateParams', '$state', '$scope', '$rootScope', 'AuthService', 'UserService', ApplicationMasterController])

    function ApplicationMasterController($stateParams, $state, $scope, $rootScope, authService, UserService) {

        // $scope.AuthService = AuthService;

        // console.log($scope.Auth.currentUser)
        /**
         * check on loged in user
         * isUserLoggedIn method will do the needfull and set all the required variabls
         */
        var auth = authService.isUserLoggedIn();
        if (auth) {
            authService.syncCurrentUserFromDb();
        } else {
            $state.go("app.account.register");
        }

        $scope.layoutModel = {business: null, noHeader: null};

    };
})();