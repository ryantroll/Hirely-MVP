/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('PasswordCtrl', ['$scope', '$rootScope', '$stateParams','$uibModalInstance', 'AuthService', PasswordCtrl ]);


    function PasswordCtrl($scope, $rootScope, $stateParams, $uibModalInstance, AuthService) {

        /**
         * [error variable initiated to nothing]
         * @type {String}
         */
        $scope.error = '';
        $scope.success = false;

        /**
         * Submit event of passwor reset form
         */
        $scope.passwordReset = function(){
            $scope.errorMsg = '';
            $scope.success = false;
            AuthService.resetPassword($scope.email).then(
                function(){
                    $scope.errorMsg = '';
                    $scope.success = true;
                    $scope.email = '';
                    /**
                     * reset for validation
                     */
                    $scope.passwordForm.$setPristine()
                    $scope.passwordForm.$setUntouched()
                },
                function(error){

                    $scope.errorMsg = error;
                    $scope.success = false;
                }
            )/// resetPassrod.then
        }//// fun. passwordReset

        /**
         * click event for close button to close the modal
         */
        $scope.closeModal = function(){
            $uibModalInstance.close();
        }
    }
})();