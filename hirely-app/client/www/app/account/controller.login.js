/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('LoginController', ['$scope', '$rootScope', '$stateParams', 'AuthService', 'UserService', LoginController ]);


    function LoginController($scope, $rootScope, $stateParams, AuthService, userService) {
        var authService = AuthService;
        var vm = this;
        $scope.error = '';
        $scope.user = {email: '', password:''};
        $scope.loginError = false;

        /**
         * Let the parent scope know it is NOT a new user
         */
        $scope.jobApplication.isNewUser = false;

        $scope.PasswordLogin = function() {
            $scope.ajaxBusy = true;
            authService.passwordLogin($scope.user.email, $scope.user.password)
                .then(
                    function(auth){

                        console.log(auth);
                        $scope.loginError = false;
                        $scope.ajaxBusy = false;
                    },
                    function(err) {
                        $scope.loginError = true;
                        $scope.ajaxBusy = false;
                    }
                );
        };




        $scope.showRegister = function(){
            /**
             * app/application/controller.job-application.js will listen to ShowRegister
             */
            $rootScope.$emit('ShowRegister');
        };


        $scope.showForgotPassword = function(){

            /**
             * app/application/controller.job-application.js will listen to ShowRegister
             */
            $rootScope.$emit('ShowForgotPassword');
        };

    }
})();