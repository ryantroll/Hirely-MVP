/**
 * Created by labrina.loving on 8/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('HeaderCtrl', ['$stateParams', '$scope', '$modal', '$log', 'AuthService', '$rootScope', HeaderCtrl ]);

    function HeaderCtrl($stateParams, $scope, $modal, $log, AuthService, $rootScope) {

        //region Scope variables
        if(!angular.isUndefined($rootScope.currentUser)){
            $scope.currentUser = $rootScope.currentUser;
        }


        //endregion

        var vm = this;
        var authService = AuthService;

        //listen for changes to current user
        $scope.$on('UserLoggedIn', function (event, user) {
            $scope.currentUser = user;
        });

        $scope.$on('UserLoggedOut', function (event) {
            delete $scope.currentUser;
        });


        //region Controller Functions
        vm.login = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/login.html',
                controller: 'LoginCtrl as vm'

            });
        };

        vm.register = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/register.html',
                controller: 'RegisterCtrl as vm'
            });
        };

        vm.hmregister = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/manager/hmRegister.html',
                controller: 'HMRegisterCtrl as vm',

            });
        };


        vm.logout = function(){
            authService.logout();
        };



        //endregion

    };
})();