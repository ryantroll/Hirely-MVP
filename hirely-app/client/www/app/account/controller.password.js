/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('PasswordController', ['$scope', '$rootScope', '$stateParams', 'AuthService', PasswordController ]);


    function PasswordController($scope, $rootScope, $stateParams, AuthService) {

        /**
         * [error variable initiated to nothing]
         * @type {String}
         */
        $scope.error = '';
        $scope.success = false;
        $scope.user = {};

        /**
         * Submit event of passwor reset form
         */
        $scope.passwordReset = function(){
            $scope.errorMsg = '';
            $scope.success = false;

            $scope.ajaxBusy = true;
            authService.resetPassword($scope.user.email).then(
                function(){
                    $scope.errorMsg = '';
                    $scope.success = true;
                    $scope.user.email = '';
                    /**
                     * reset for validation
                     */
                    $scope.resetForm.$setPristine()
                    $scope.resetForm.$setUntouched()
                    $scope.ajaxBusy = false;
                },
                function(error){
                    $scope.errorMsg = error;
                    $scope.success = false;
                    $scope.ajaxBusy = false;
                }
            )/// resetPassrod.then
        }//// fun. passwordReset

        $scope.cancelClick = function(){
            $rootScope.$emit('ShowLogin');
        }

        $scope.resetErrors = function(){
            $scope.errorMsg = '';
            $scope.success = false;
        }

    }
})();