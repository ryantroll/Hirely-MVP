/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('RegisterCtrl', ['$scope','$stateParams','$modalInstance', 'AuthService', 'UserService', RegisterCtrl ]);

    function RegisterCtrl($scope, $stateParams,  $modalInstance,AuthService, UserService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        $scope.error = '';

        vm.FbRegister = function () {

           authService.thirdPartyLogin('facebook')
               .then(function(user) {
                  userService.createUserfromFb(user);
               }, function(err) {
                  alert('failure')
               })


        }

        vm.CloseModal = function (){
            $modalInstance.close();
        }
    }




})()
;
