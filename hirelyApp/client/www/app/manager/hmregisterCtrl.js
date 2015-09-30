/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.manager').controller('HMRegisterCtrl', ['$scope', '$stateParams', '$modalInstance', 'AuthService', 'UserService', 'BusinessService', 'GeocodeService',  HMRegisterCtrl ]);

    function HMRegisterCtrl($scope, $stateParams, $modalInstance, AuthService, UserService, BusinessService, GeocodeService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        var businessService = BusinessService;
        var geocodeService = GeocodeService;

        $scope.error = '';
        $scope.manager = {email: '', password: '', firstName: '', lastName: ''}
        $scope.business = {name: '', description: '', address: '', street: '', city: '', state: '', zip: '', country: '', lat: '', lon: '', webaddress: '', OHours0: '', CHours0: '', OHours1: '', CHours1: '', OHours2: '', CHours2: '', OHours3: '', CHours3: '', OHours4: '', CHours4: '', OHours5: '', CHours5: '', OHours6: '', CHours6: ''}
       
        $scope.results = '';
        $scope.options = {types: 'address'};
        $scope.hmdetails = '';

        var place = geocodeService.getPlace();
        if(place){
            $scope.results = place.formatted_address;
            $scope.hmdetails = place;
        }


        vm.FbRegister = function () {var geocodeService = GeocodeService;

        $scope.getResults = function() {
            geocodeService.setPlace($scope.hmdetails);

        }

        vm.FbRegister = function () {
            registerThirdPartyHM('facebook')
        }

        vm.GoogleRegister = function () {
            registerThirdPartyHM('google')
        }

        vm.TwitterRegister = function () {
            registerThirdPartyHM('twitter')
        }

        vm.registerNewHMBUS = function() {
            registerPasswordHM($scope.manager, $scope.business)
            $state.go('app.busDashboard');
        }
       
        vm.CloseModal = function (){
            $modalInstance.close();
        }

        //this function registers hiring manager in 3rd party and
        //and then creates Firebase db
        function registerThirdPartyHM(provider, scope) {
            authService.thirdPartyLogin(provider, scope)
                .then(function(user) {
                    userService.createUserfromThirdParty(provider, user)
                        .then(function(fbUser){
                            userService.setCurrentUser(fbUser, provider.uid);
                            $modalInstance.close();
                        }, function(err) {
                            alert(err)
                        });
                }, function(err) {
                    alert(err)
                })
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


  }

})();
