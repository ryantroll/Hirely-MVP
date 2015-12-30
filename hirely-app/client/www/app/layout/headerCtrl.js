/**
 * Created by labrina.loving on 8/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('HeaderCtrl', ['$stateParams', '$scope', '$rootScope', '$modal', '$log', 'AuthService', '$rootScope', HeaderCtrl ]);

    function HeaderCtrl($stateParams, $scope, $rootScope, $modal, $log, AuthService) {

        //region Scope variables
        if(!angular.isUndefined(AuthService.currentUser)){
            $scope.currentUser = AuthService.currentUser;
        }


        //endregion

        var vm = this;
        var authService = AuthService;

        /**
         * Listen to change in user login status to set local $scope variable
         *
         */
        $scope.$on('UserLoggedIn', function (event, user) {
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

        /**
         * Listen to showLogin event that emited from different controller "registerCtrl.js" when there is a need to show the login form in modal
         * the the loginListener is used to remove the listener when $scope is destroyed
         */
        var logInListener = $rootScope.$on('ShowLogin', function(event){
            vm.login();
        });

        /**
         * Listent to ShowRegister event that emited from different controlers "loginCtrl.js"
         * to show the regstration form
         */
        var regListener = $rootScope.$on('ShowRegister', function(event){
            vm.register();
        });

        /**
         * Listent to ShowForgotPassword event that emited from "LoginCtrl.js" to show rest password
         */
        var passListener = $rootScope.$on('ShowForgotPassword', function(event){
            vm.hmforgotpassword();
        })

        /**
         * Listent to $destroy event and remove listener from $rootScope
         */
        $scope.$on('$destroy', function(){
            regListener();
            logInListener();
            passListener();
        });


        //region Controller Functions
        vm.login = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/login.html',
                controller: 'LoginCtrl as vm'

            });
        };

        vm.register = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/register.html',
                controller: 'RegisterCtrl as vm'
            });
        };

        vm.hmregister = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/manager/hmRegister.html',
                controller: 'HMRegisterCtrl as vm',

            });
        };

        vm.hmforgotpassword = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/password.html',
                controller: 'PasswordCtrl as vm'
            });
        }

        vm.logout = function(){
            authService.logout();
        };



        //endregion

    };
})();