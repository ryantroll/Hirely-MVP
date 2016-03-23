/**
 * Created by Iyad Bitar on 11/02/2016.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout')

    .controller('BusinessHeaderController', ['$stateParams', '$scope', 'AuthService', 'UserService', 'DEFAULT_PROFILE_IMAGE', BusinessHeaderController ])

    function BusinessHeaderController($stateParams, $scope, AuthService, UserService, DEFAULT_PROFILE_IMAGE) {
        $scope.auth = AuthService;
        $scope.defaultImage = DEFAULT_PROFILE_IMAGE;
        $scope.showUserMenu = false;

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


        $scope.toggleUserMenu = function(event){
            var handleMenuClick = function(e){
                if(true === $scope.showUserMenu){
                    $scope.showUserMenu = false;
                    $scope.$apply();
                    //// unbind when menu closed no need to check for click
                    $('body').unbind('click', handleMenuClick);
                }
                else{
                    $scope.showUserMenu = true;
                    $scope.$apply();
                }
            };
            /**
             * the event will bubble up to body so do the work on body click \ only if menu is closed
             * this to make sure the menu is closed when click outside the menu
             */
            if(false === $scope.showUserMenu){
                $('body').bind('click', handleMenuClick);
            }
        }

    };


})();