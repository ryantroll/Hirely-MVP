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
                        $scope.ajaxBusy = false;
                    },
                    function(err) {
                        alert(err);
                        $scope.ajaxBusy = false;
                    }
                );
        };




        $scope.showRegister = function(){
            /**
             * headerCtrl.js will listen to ShowRegister
             */
            $rootScope.$emit('ShowRegister');
        };


        $scope.showForgotPassword = function(){

            /**
             * headerCtrl.js will listen to ShowRegister
             */
            $rootScope.$emit('ShowForgotPassword');
        };

    }
})();