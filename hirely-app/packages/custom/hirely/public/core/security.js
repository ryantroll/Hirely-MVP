/**
 * Created by labrina.loving on 8/9/2015.
 */
(function (angular) {
    "use strict";

      var securedRoutes = [];

    angular.module('mean.hirely.core')

    /**
     * Apply some route security. Any route's resolve method can reject the promise with
     * { authRequired: true } to force a redirect. This method enforces that and also watches
     * for changes in auth status which might require us to navigate away from a path
     * that we can no longer view.
     */
         .run(['$rootScope', '$state', 'AuthService', 'UserService', 'loginRedirectPath',
            function ($rootScope, $state, AuthService, UserService, loginRedirectPath) {
                // watch for login status changes and redirect if appropriate
                AuthService.AuthRef().$onAuth(check);

                // some of our routes may reject resolve promises with the special {authRequired: true} error
                // this redirects to the login page whenever that is encountered
                $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
                    if (error === "AUTH_REQUIRED") {
                        $state.go(loginRedirectPath);
                    }
                });

                $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                    AuthService.AuthRef().$onAuth(check);
                    if (toState.authRequired && !UserService.getIsLoggedIn()){
                        // User isn’t authenticated
                        $state.transitionTo(loginRedirectPath);
                        event.preventDefault();
                    }
                });



                function check(user) {
                    if (!user && $state.current.authRequired) {
                         $state.go(loginRedirectPath);
                    }
                }

            }
        ]);

})(angular);

