/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('LoginController', ['$scope', '$rootScope', '$stateParams','$uibModalInstance', 'AuthService', 'UserService', LoginController ]);


    function LoginController($scope, $rootScope, $stateParams, $uibModalInstance, AuthService, userService) {
        var authService = AuthService;
        var vm = this;
        $scope.error = '';
        $scope.user = {email: '', password:''};

        vm.FbLogin = function(){
           authService.thirdPartyLogin('facebook')
               .then(function(data){
                   $uibModalInstance.close();
               }, function(err) {

                   $scope.error = errMessage(err);
               }
           );

        };

        vm.GoogleLogin = function(){
            authService.thirdPartyLogin('google')
                .then(function(data){
                    $uibModalInstance.close();

                }, function(err) {

                    $scope.error = errMessage(err);
                }
            );

        };


        vm.PasswordLogin = function() {
            authService.passwordLogin($scope.user.email, $scope.user.password)
                .then(function(auth){
                    $uibModalInstance.close();
                }, function(err) {
                    alert(err)
                });
        };


        vm.CloseModal = function (){
            $uibModalInstance.close();
        };

        vm.signupClick = function(){
            $uibModalInstance.close();
            /**
             * headerCtrl.js will listen to ShowRegister
             */
            $rootScope.$emit('ShowRegister');
        };


        vm.forgotPassword = function(){
            $uibModalInstance.close();
            /**
             * headerCtrl.js will listen to ShowRegister
             */
            $rootScope.$emit('ShowForgotPassword');
        };

    }
})();