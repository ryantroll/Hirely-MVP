/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.manager').controller('HMRegisterCtrl', ['$scope', '$stateParams',  '$modalInstance', '$state', 'AuthService', 'UserService', 'BusinessService', 'GeocodeService',  HMRegisterCtrl ]);

    function HMRegisterCtrl($scope, $stateParams, $modalInstance, $state, AuthService, UserService, BusinessService, GeocodeService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        var businessService = BusinessService;
        var geocodeService = GeocodeService;

        $scope.error = '';
        $scope.manager = {email: '', password: '', firstName: '', lastName: ''}
        $scope.business = {name: '', description: '', street_number: '', route: '', locality: '', administrative_area_level_1: '', 
        postal_code: '', country: '', latitude: '', longitude: '', webaddress: '', open_store_hours0: '', 
        closed_store_hours0: '', open_store_hours1: '', closed_store_hours1: '', open_store_hours2: '', closed_store_hours2: '', 
        open_store_hours3: '', closed_store_hours3: '', open_store_hours4: '', closed_store_hours4: '', open_store_hours5: '', 
        closed_store_hours5: '', open_store_hours6: '', closed_store_hours6: ''}
      
        vm.registerNewHMBUS = function() {
            registerPasswordHM($scope.manager, $scope.business)
        }
       
        vm.CloseModal = function (){
            $modalInstance.close();
        }

       
        function registerPasswordHM(registeredUser, newbusinessObj){
            //register new hiring manager
            authService.registerNewUser(registeredUser.email, registeredUser.password)
                .then(function(manager) {
                    userService.createRegisteredNewUser(registeredUser, manager.uid)
                        .then(function(newUser){
                            authService.passwordLogin(registeredUser.email, registeredUser.password)
                                .then(function(auth){
                                    userService.setCurrentUser(newUser, manager.uid);
                                    businessService.createNewBusiness(newbusinessObj);
                                    $modalInstance.close();
                                    $state.go('app.busDashboard');
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
