/**
 * Created by labrina.loving on 8/9/2015.
 */
(function (angular) {
    "use strict";

      var securedRoutes = [];

    angular.module('hirelyApp.core')

    /**
     * Apply some route security. Any route's resolve method can reject the promise with
     * { authRequired: true } to force a redirect. This method enforces that and also watches
     * for changes in auth status which might require us to navigate away from a path
     * that we can no longer view.
     */
         .run(['$rootScope', '$state', 'AuthService', 'UserService', 'loginRedirectPath',
            function ($rootScope, $state, authService, userService, loginRedirectPath) {

                if (angular.isUndefined($rootScope.nextState)) {
                    $rootScope.nextState = [];
                }

                $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                    // If user is logged in, refresh token. If fails, redirect to login
                    authService.refreshSession().then(function() {
                        if (toState.authRequired && !$rootScope.currentUserId){
                            $rootScope.nextState.push({state:toState, params:toParams})
                            $state.go(loginRedirectPath, {message: "You must login to view this page."});
                            event.preventDefault();
                        }
                    });



                });

                $rootScope.$on('TokenExpired', function(event, args) {
                    authService.logout();
                    if ($state.current.authRequired) {
                        console.log("Caught private page with token expired");
                        $rootScope.nextState.push({state:$state.current.name, params:$state.params})
                        $state.go(loginRedirectPath, {message: "Sorry, your session has expired."});
                    }
                });

            }
        ]);

})(angular);

