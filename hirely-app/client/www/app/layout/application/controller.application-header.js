/**
 * Created by Iyad Bitar on 11/02/2016.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout')

    .controller('ApplicationHeaderController', ['$stateParams', '$scope', 'AuthService', 'UserService', 'DEFAULT_PROFILE_IMAGE', ApplicationHeaderController ])

    function ApplicationHeaderController($stateParams, $scope, AuthService, UserService, DEFAULT_PROFILE_IMAGE) {
        $scope.auth = AuthService;
        $scope.defaultImage = DEFAULT_PROFILE_IMAGE;

        /**
         * Listen to change in user login status to set local $scope variable
         *
         */
        $scope.$on('UserLoggedIn', function (event, user) {
            // console.log(AuthService.currentUser)
            $scope.currentUser = user;
        });

        /**
         * Lsiten to user logout event to remove local scope variable
         */
        $scope.$on('UserLoggedOut', function (event) {
            delete $scope.currentUser;
        });

        /**
         * Listen if there is any data change in current user, sent when logged in user update his profile
         */
        $scope.$on('UserDataChange', function (event, user) {
            $scope.currentUser = user;
        });

        $scope.userLogout = function(){
            AuthService.logout();
        }

    };


})();