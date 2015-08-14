/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('MasterCtrl', ['$stateParams', '$scope', '$modal', '$log', '$q', 'AuthService', 'UserService',MasterCtrl ]);

    function MasterCtrl($stateParams, $scope, $modal, $log, $q, AuthService, UserService) {

        var vm = this;

        $scope.authRef = AuthService.AuthRef();
        $scope.userService = UserService;
        $scope.currentUser = null;
        // any time auth status updates, add the user data to scope
        $scope.authRef.$onAuth(function(authData) {
           if(authData)
            {
                if(!$scope.currentUser) {
                    //try to retrieve user
                    $scope.userService.getUserByKey(authData.uid)
                        .then(function (snapshot) {
                            var exists = (snapshot.val() != null);
                            if (exists) {
                                $scope.userService.setCurrentUser(snapshot.val(), snapshot.key());
                                $scope.userService.setIsLoggedIn(true);
                            }

                        }, function (err) {

                        });
                }
            }
            else
            {
                $scope.userService.setIsLoggedIn(false);
                $scope.userService.setCurrentUser(null)
            }
        });

            //watch for user auth changes, if changed broadcast to pages
            $scope.$watch('userService.getCurrentUser()', function (newVal) {
                $scope.$broadcast('currentUserChanged', { message: newVal });
                $scope.currentUser = newVal;

        },true);

    };
})();