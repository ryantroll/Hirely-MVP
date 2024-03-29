/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('LoginController', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', 'AuthService', LoginController ]);


    function LoginController($scope, $rootScope, $state, $stateParams, $timeout, AuthService) {


        $scope.error = '';
        $scope.user = {email: '', password:''};
        $scope.loginError = false;

        $scope.message = $stateParams.message;

        $timeout(function() {
            $(window).scrollTop(0);
        });

        /**
         * Let the parent scope know it is NOT a new user
         */
        // $scope.jobApplication.isNewUser = false;

        $scope.passwordLogin = function() {
            $scope.ajaxBusy = true;
            console.log("Login:passwordLogin:info:logging in...");
            AuthService.passwordLogin($scope.user.email, $scope.user.password)
                .then(
                    function(user){
                        // console.dir(user);
                        if (!user) {
                            $scope.loginError = true;
                            $scope.ajaxBusy = false;
                            return;
                        }
                        $scope.loginError = false;
                        $scope.ajaxBusy = false;

                        $scope.goToNextState();
                    },
                    function(err) {
                        $scope.loginError = true;
                        $scope.ajaxBusy = false;
                    }
                );
        };

        $scope.goToNextState = function() {

            if($rootScope.nextState.length) {
                var nextState = $rootScope.nextState.pop();
                if (nextState.state) {
                    $state.go(nextState.state, nextState.params);
                } else {
                    $scope.goToNextState()
                }
            }
            else{
                $state.go('master.default.dashboard')
            }
        }


        $scope.showForgotPassword = function(){
            alert("Please email us at support@hirely.us to reset your password.");
            return;

            /**
             * app/application/controller.job-application.js will listen to ShowRegister
             */
            $rootScope.$emit('ShowForgotPassword');
        };

        $scope.cancelLogin = function() {
            console.log("IN cancel");
            if($rootScope.nextState.length) {
                var nextState = $rootScope.nextState.pop();
                $state.go(nextState.state, nextState.params);
            }
            else{
                console.log("2");
                $state.go('master.default.dashboard')
            }
        };

    }
})();