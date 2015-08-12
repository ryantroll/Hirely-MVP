/**
 * Created by labrina.loving on 8/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('HeaderCtrl', ['$stateParams', '$scope', '$modal', '$log', 'UserService', HeaderCtrl ]);

    function HeaderCtrl($stateParams, $scope, $modal, $log, UserService) {

        //region Scope variables
        $scope.currentUser = $scope.$parent.currentUser;
        //endregion

        var vm = this;

        //listen for changes to current user
        $scope.$on('currentUserChanged', function (event, args) {
            $scope.currentUser = args.message;
        });


        //region Controller Functions
        vm.login = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/login.html',
                controller: 'LoginCtrl',
                resolve: {
                    items: function () {

                    }
                }
            });
        };

        vm.register = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/register.html',
                controller: 'RegisterCtrl as vm'
            });
        };
        //endregion

    };
})();