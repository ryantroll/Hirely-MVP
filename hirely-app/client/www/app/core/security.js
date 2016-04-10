(function (angular) {
    "use strict";

    angular.module('hirelyApp.core')

    /**
     * Apply some route security. Any route's resolve method can reject the promise with
     * { authRequired: true } to force a redirect. This method enforces that and also watches
     * for changes in auth status which might require us to navigate away from a path
     * that we can no longer view.
     */
         .run(['$rootScope', '$state', '$stateParams', 'BusinessService', 'AuthService', 'loginRedirectPath',
            function ($rootScope, $state, $stateParams, BusinessService, AuthService, loginRedirectPath) {

                var AuthInitted = false;

                function handleAuthRequiredRedirect(toState, toParams, event, msg) {
                    if (!AuthInitted) {
                        console.log("S:handleAuthRequiredRedirect:info:0: Skipping because auth not init yet");
                        return;
                    }
                    console.log("S:handleAuthRequiredRedirect:info:0: "+AuthService.currentUserId+":"+toState.name+":"+toState.authRequired);
                    if (toState.authRequired && !AuthService.token.remainingTime){
                        $rootScope.nextState.push({state:toState.name, params:toParams});

                        if (toState.name == 'master.application.apply') {
                            console.log("S:handleAuthRequiredRedirect:info:1: Caught apply without login");
                            getPositionTitleFromParams(toParams).then(function(positionTitle) {
                                console.log("PosTitle = "+positionTitle);
                                $state.go('master.default.account.registerWithMessage', {message:"Please register or login to apply for "+positionTitle});
                            });
                        } else {
                            console.log("S:handleAuthRequiredRedirect:info:2: Redirecting to login");
                            if (!msg) {
                                msg = "You must login to view this page."
                            }
                            $state.go(loginRedirectPath, {message: msg});
                        }
                        if (event) {
                            event.preventDefault();
                        }
                    }
                }

                $rootScope.$on('AuthInitted', function(event, args) {
                    AuthInitted = true;
                    console.log("S:AuthInitted:info:0: Caught Auth Init");
                    handleAuthRequiredRedirect($state.current.name, $state.params, event);
                });

                $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                    console.log("S:$stateChangeStart:info:0: Caught state change: "+fromState.name+" to "+toState.name);
                    handleAuthRequiredRedirect(toState, toParams, event);
                });

                $rootScope.$on('UserLoggedOut', function(event, args) {
                    console.log("S:TokenExpired:info:0: Caught user logged out");
                    handleAuthRequiredRedirect($state.current.name, $state.params, event);
                });
                
                function getPositionTitleFromParams(params) {
                    return BusinessService.getBySlug(params.businessSlug)
                        .then(function (business) {
                            return BusinessService.positionBySlug(params.positionSlug, params.locationSlug, business).title;
                        }
                    );

                }
            }
        ]);

})(angular);

