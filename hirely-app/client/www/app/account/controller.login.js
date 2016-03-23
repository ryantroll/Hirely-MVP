/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('LoginController', ['$scope', '$rootScope', '$state', '$stateParams', 'AuthService', 'UserService', LoginController ]);


    function LoginController($scope, $rootScope, $state, $stateParams, AuthService, userService) {
        var authService = AuthService;
        var vm = this;
        $scope.error = '';
        $scope.user = {email: '', password:''};
        $scope.loginError = false;

        /**
         * Let the parent scope know it is NOT a new user
         */
        // $scope.jobApplication.isNewUser = false;

        $scope.passwordLogin = function() {
            $scope.ajaxBusy = true;
            console.log("logging in...");
            authService.passwordLogin($scope.user.email, $scope.user.password)
                .then(
                    function(user){
                        console.dir(user);
                        if (!user) {
                            $scope.loginError = true;
                            $scope.ajaxBusy = false;
                            return;
                        }
                        $scope.loginError = false;
                        $scope.ajaxBusy = false;

                        /**
                         * Check if nextState is set in rootScope and redirect user to it
                         */
                        if(angular.isDefined($rootScope.nextState)){
                            $state.go($rootScope.nextState.state, $rootScope.nextState.params);
                            delete $rootScope.nextState;
                        }
                        else{
                            $state.go('app.home')
                        }
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
            alert("Please email us at support@hirely.io to reset your password.");
            return;

            /**
             * app/application/controller.job-application.js will listen to ShowRegister
             */
            $rootScope.$emit('ShowForgotPassword');
        };

        $scope.cancelRegistration = function() {
            console.log("IN cancel");
            if(angular.isDefined($rootScope.nextState)){
                console.log("1");
                $state.go($rootScope.nextState.state, $rootScope.nextState.params);
                delete $rootScope.nextState;
            }
            else{
                console.log("2");
                $state.go('user.profile')
            }
        };

    }
})();