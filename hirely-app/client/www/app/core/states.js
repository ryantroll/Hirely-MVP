(function (angular) {
    "use strict";

    angular.module('hirelyApp.core')
        .run(['$rootScope', '$state',
            function ($rootScope, $state) {
                if (angular.isUndefined($rootScope.nextState)) {
                    $rootScope.nextState = [];
                }

                $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
                    if (toState.name == 'master.application.applyTmp') {
                        console.warn("S:$stateChangeStart:warn:0: caught applyTmp redirect state. Redirecting.")
                        toParams.positionSlug = 'team-member';
                        $state.go('master.application.apply', toParams);
                        event.preventDefault();
                    }
                });

            }
        ]);
})(angular);

