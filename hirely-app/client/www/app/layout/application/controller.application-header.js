/**
 * Created by Iyad Bitar on 11/02/2016.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout')

    .controller('ApplicationHeaderController', ['$stateParams', '$scope', 'AuthService', 'UserService', ApplicationHeaderController ])

    function ApplicationHeaderController($stateParams, $scope, AuthService, UserService) {
        $scope.auth = AuthService;

    };
})();