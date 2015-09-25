/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.manager').controller('HMRegisterCtrl', ['$scope', '$stateParams', '$modalInstance', 'AuthService', 'UserService', 'GeocodeService',  HMRegisterCtrl ]);

    function HMRegisterCtrl($scope, $stateParams, $modalInstance, AuthService, UserService, GeocodeService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        var geocodeService = GeocodeService;

        $scope.error = '';
        $scope.manager = {email: '', password: '', firstName: '', lastName: ''}

        vm.FbRegister = function () {var geocodeService = GeocodeService;

        $scope.results = '';
        $scope.options = {
            types: 'address'
        };
        $scope.hmdetails = '';

        var place = geocodeService.getPlace();
        if(place){

            $scope.results = place.formatted_address;
            $scope.hmdetails = place;
        }

        $scope.getResults = function() {
            geocodeService.setPlace($scope.hmdetails);

        }

        vm.createDashboard = function() {
            $state.go('app.busDashboard');

        }

        vm.FbRegister = function () {
            registerThirdPartyUser('facebook')
        }

        vm.GoogleRegister = function () {
            registerThirdPartyUser('google')
        }

        vm.TwitterRegister = function () {
            registerThirdPartyUser('twitter')
        }

        vm.registerNewUser = function() {
            registerPasswordUser($scope.manager)
        }

        vm.CloseModal = function (){
            $modalInstance.close();
        }

        //this function registers hiring manager in 3rd party and
        //and then creates Firebase db
        function registerThirdPartyUser(provider, scope) {
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

        function registerPasswordUser(registeredUser){
            //register new hiring manager
            authService.registerNewUser(registeredUser.email, registeredUser.password)
                .then(function(user) {
                    userService.createRegisteredNewUser(registeredUser, user.uid)
                        .then(function(newUser){
                            authService.passwordLogin(registeredUser.email, registeredUser.password)
                                .then(function(auth){
                                    userService.setCurrentUser(newUser, user.uid);
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
