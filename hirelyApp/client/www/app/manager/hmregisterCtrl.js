/**
 * Created by mike.baker on 9/29/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.manager').controller('HMRegisterCtrl', ['$scope', '$state', '$stateParams', '$modalInstance', 'AuthService', 'UserService', 'FBURL', 'BusinessService', HMRegisterCtrl ]);

    function HMRegisterCtrl($scope, $state, $stateParams, $modalInstance, AuthService, UserService, FBURL, BusinessService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        var businessService = BusinessService;
        var managerId = '';

        $scope.error = '';
        $scope.manager = {email: '', password: '', firstName: '', lastName: '', userType: 'HM'}
        
        vm.registerManager = function() {
            registerHiringManager($scope.manager);
        }
       
        vm.CloseModal = function (){
            $modalInstance.close();
        }

        function registerHiringManager(registeredUser){
            //register new hiring manager
            authService.registerNewUser(registeredUser.email, registeredUser.password)
                .then(function(user) {
                    userService.createRegisteredNewUser(registeredUser, user.uid)
                        .then(function(newUser){
                            authService.passwordLogin(registeredUser.email, registeredUser.password)
                                .then(function(auth){
                                    managerId = user.uid;
                                    userService.setCurrentUser(newUser,user.uid);
                                    businessService.setCurrentUser(newUser,user.uid);
                                    $modalInstance.close();
                                    $state.go('app.hmBusSite');    
                                }, function(err) {
                                    alert(err)
                                });
                        }, function(err) {
                            alert(err)
                        });
                }, function(err) {
                    alert(err)
                })
            
           }
}


})();
