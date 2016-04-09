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
         .run(['$rootScope', '$state', '$stateParams', 'AuthService', 'UserService', 'BusinessService', 'loginRedirectPath',
            function ($rootScope, $state, $stateParams, authService, userService, businessService, loginRedirectPath) {

                if (angular.isUndefined($rootScope.nextState)) {
                    $rootScope.nextState = [];
                }

                function handleAuthRequiredRedirect(toState, toParams, event) {
                    if (toState.authRequired && !$rootScope.currentUserId){
                        $rootScope.nextState.push({state:toState, params:toParams})

                        if (toState.name == 'master.application.apply') {
                            console.log("Caught apply without login");
                            getPositionTitleFromParams(toParams).then(function(positionTitle) {
                                console.log("PosTitle = "+positionTitle);
                                $state.go('master.default.account.registerWithMessage', {message:"Please register or login to apply for "+positionTitle});
                            });
                        } else {
                            $state.go(loginRedirectPath, {message: "You must login to view this page."});
                        }
                        if (event) {
                            event.preventDefault();
                        }
                    }
                }
                // Run on initialization, just in case it doesn't get caught by $stateChangeStart, which I suspect it does sometimes
                handleAuthRequiredRedirect($state, $stateParams, event);

                $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                    // If user is logged in, refresh token. If fails, redirect to login
                    authService.refreshSession().then(function() {
                        handleAuthRequiredRedirect(toState, toParams, event)
                    });
                });

                $rootScope.$on('TokenExpired', function(event, args) {
                    authService.logout();
                    if ($state.current.authRequired) {
                        $rootScope.nextState.push({state:$state.current.name, params:$state.params});
                        $state.go(loginRedirectPath, {message: "Sorry, your session has expired."});
                    } else {
                        $rootScope.$apply();
                    }
                });

                function getPositionTitleFromParams(params) {
                    return businessService.getBySlug(params.businessSlug)
                        .then(function (business) {
                            return businessService.positionBySlug(params.positionSlug, params.locationSlug, business).title;
                        }
                    );

                }
            }
        ]);

})(angular);

