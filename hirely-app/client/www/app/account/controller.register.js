/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account')
        .directive('validatePassword', function () {
            return {
                // TODO:  Consider if we can use ng-pattern like we do for basic info postal code
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, ele, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (value) {
                        // Contains at least 8 chars, 1 lowercase, 1 uppercase, and 1 number.
                        var minSatRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[0-9a-zA-Z]{8,}$/;

                        // ctrl.$setValidity('invalidPassword', minSatRegex.test(value) && freeFromBannedRegex.test(value));
                        ctrl.$setValidity('invalidPassword', minSatRegex.test(value));
                        return value;
                    });/// unshift
                }//// fun. link
            }/// return object
        })/// validate date;

        .controller('RegisterController', ['$location', '$scope', '$rootScope', '$state', '$stateParams', '$timeout', 'AuthService', RegisterController]);

    function RegisterController($location, $scope, $rootScope, $state, $stateParams, $timeout, AuthService) {

        $scope.error = '';
        $scope.user = {email: '', password: '', firstName: '', lastName: ''};

        if ($location.search().inv) {
            $scope.user.invitation = $location.search().inv;
            $scope.businessName = $location.search().b;
        }

        $scope.message = $stateParams.message;

        $timeout(function () {
            $(window).scrollTop(0);
        });

        $scope.resetEmailValidity = function () {
            $scope.registerForm.email.$setValidity('emailExists', true);
        };

        $scope.handleRgisterForm = function () {
            if (!$scope.registerForm.$valid) {
                return null;
            }
            $scope.ajaxBusy = true;
            registerPasswordUser($scope.user);
        };

        $scope.cancelRegistration = function () {
            if ($rootScope.nextState.length) {
                var nextState = $rootScope.nextState.pop();
                $state.go(nextState.state, nextState.params);
            }
            else {
                $state.go('master.default.user.profile')
            }
        }

        function registerPasswordUser(registeredUser) {
            /**
             * Let the parent scope know it is a new regitered user
             */

            // $scope.jobApplication.isNewUser = true;


            //register new user
            AuthService.registerNewUser(registeredUser)
                .then(
                    function (user) {
                        if (user) {
                            $scope.registerForm.email.$setValidity('emailExists', true);
                            /**
                             * Check if nextState is set in rootScope and redirect user to it
                             */
                            if ($rootScope.nextState.length) {
                                var nextState = $rootScope.nextState.pop();
                                $state.go(nextState.state, nextState.params);
                                delete $rootScope.nextState;
                            }
                            else {
                                $state.go('master.default.dashboard')
                            }
                        } else {
                            $scope.registerForm.email.$setValidity('emailExists', false);
                        }


                        $scope.ajaxBusy = false;
                        return user;
                    },
                    function (err) {
                        /**
                         * User authentication couldn't be created
                         */
                        $scope.registerForm.email.$setValidity('emailExists', false);
                        $scope.ajaxBusy = false;
                    }
                )


        }//// fun. registerPasswrodUser


    } // end ctrl


})();
