/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('MasterCtrl', ['$stateParams', '$scope', '$modal', '$log', 'AuthService', 'UserService',MasterCtrl ]);

    function MasterCtrl($stateParams, $scope, $modal, $log, AuthService, UserService) {

        var vm = this;
        $scope.authRef = AuthService.AuthRef();
        $scope.userService = UserService;
        $scope.currentUser = null;
        // any time auth status updates, add the user data to scope
        $scope.authRef.$onAuth(function(authData) {

            if(authData)
            {
                UserService.setIsLoggedIn(true);

                //check if user is populated, populate if not
            }
            else
            {
               UserService.setIsLoggedIn(false);
                UserService.setCurrentUser(null)
            }
        });

            //watch for user auth changes, if changed broadcast to pages
            $scope.$watch('userService.getCurrentUser()', function (newVal) {
                $scope.$broadcast('currentUserChanged', { message: newVal });
                $scope.currentUser = newVal;

        },true);

    };
})();