/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('mean.hirely.account').controller('LoginCtrl', ['$scope','$stateParams','$modalInstance', 'AuthService', LoginCtrl ]);


    function LoginCtrl($scope, $stateParams, $modalInstance, AuthService) {
        var authService = AuthService;
        var vm = this;
        $scope.error = '';
        $scope.user = {email: '', password:''};

        vm.FbLogin = function(){
           authService.thirdPartyLogin('facebook')
               .then(function(data){
                   $modalInstance.close();

               }, function(err) {

                   $scope.error = errMessage(err);
               }
           );

        };

        vm.GoogleLogin = function(){
            authService.thirdPartyLogin('google')
                .then(function(data){
                    $modalInstance.close();

                }, function(err) {

                    $scope.error = errMessage(err);
                }
            );

        };

        vm.PasswordLogin = function() {
            authService.passwordLogin($scope.user.email, $scope.user.password)
                .then(function(auth){
                    $modalInstance.close();
                }, function(err) {
                    alert(err)
                });
        };


        vm.CloseModal = function (){
            $modalInstance.close();
        };
    }
})();