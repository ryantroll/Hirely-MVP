/**
 * Created by Iyad Bitar on 11/02/2016.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout')
    .directive("applicationFooter", function() {
        return {
            restrict: 'A',
            templateUrl: 'app/layout/application/application-footer.tpl.html',
            scope: true,
            transclude : false
        };
    })
    .directive("applicationHeader", function() {
        return {
            restrict: 'A',
            templateUrl: 'app/layout/application/application-header.tpl.html',
            controller: 'ApplicationHeaderController',
            scope: true,
            transclude : false
        };
    })
    .controller('ApplicationMasterController', ['$stateParams', '$scope', 'AuthService', 'UserService', ApplicationMasterController ])

    function ApplicationMasterController($stateParams, $scope, AuthService, UserService) {

        // $scope.authService = AuthService;

        // console.log($scope.Auth.currentUser)
        /**
         * check on loged in user
         * getAuth method will do the needfull and set all the required variabls
         */
        var auth = AuthService.getAuth()
            .then(
                function(isAuth){
                    if(isAuth){
                        console.log('User ' + AuthService.currentUser.firstName + ' is logged in');
                    }
                },
                function(error){
                    console.log('No user is logged in');
                }
            )/// Auth then
    };
})();