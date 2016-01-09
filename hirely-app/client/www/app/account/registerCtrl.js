/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('RegisterCtrl', ['$scope', '$rootScope', '$stateParams', '$uibModalInstance', 'AuthService', 'UserService', RegisterCtrl ]);

    function RegisterCtrl($scope, $rootScope, $stateParams, $uibModalInstance, AuthService, UserService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        $scope.error = '';
        $scope.user = {email: '', password: '', firstName: '', lastName: '', userType: 'JS'}

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
            $scope.user.provider = 'password';
            // $scope.user.email = Math.round(Math.random()*1000).toString() + $scope.user.email;
            registerPasswordUser($scope.user)
        }

        vm.CloseModal = function (){
            $uibModalInstance.close();
        }

        vm.goToLogin = function(event){
            $uibModalInstance.close();
            /**
             * headerCtrl.js will listen to showLogin event
             */
            $rootScope.$emit('ShowLogin');
        }

        //this function registers user in 3rd party and
        //and then creates Firebase db
        function registerThirdPartyUser(provider, scope) {
            authService.thirdPartyLogin(provider, scope)
                .then(function(user) {
                    userService.createUserfromThirdParty(provider, user)
                        .then(function(fbUser){
                            userService.setCurrentUser(fbUser, provider.uid);
                            $uibModalInstance.close();
                        }, function(err) {
                            alert(err)
                        });
                }, function(err) {
                    alert(err)
                })
        }

        function registerPasswordUser(registeredUser){
            //register new user
            userService.registerNewUser(registeredUser.email, registeredUser.password)
                .then(function(user) {
                    /**
                     * User authentication is created successfully
                     * Create user object in database
                     */
                    userService.createRegisteredNewUser(registeredUser, user.uid)
                        .then(function(newUserData){
                            /**
                             * user object created successfully in DB
                             * Login registered user
                             */
                            authService.passwordLogin(registeredUser.email, registeredUser.password)
                                .then(function(auth){
                                    // authService.setCurrentUser(newUserData, user.uid);
                                    $uibModalInstance.close();
                                }, function(err) {
                                    /**
                                     * Error in login for new registered user
                                     */
                                    alert(err)
                                });
                        }, function(err) {
                            /**
                             * user object couldn't be save in DB
                             * Remove the user from authentication DB
                             */
                            userService.removeUser(registeredUser.email, registeredUser.password)
                            .then(
                                function(result){
                                    if(true === result){

                                    }
                                    $uibModalInstance.close();
                                },
                                function(error){
                                    // console.log('remove error');
                                    // console.log(error);
                                    $uibModalInstance.close();
                                }
                            );
                            alert('System Error!\n\n' + err);

                        });
                }, function(err) {
                    /**
                     * User authentication couldn't be created
                     */
                    alert(err)
                })

        }


    }




})();
