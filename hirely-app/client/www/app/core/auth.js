(function (angular) {
    "use strict";

    angular.module('hirelyApp.core')
         .run(['$rootScope', '$interval', 'AuthService',
            function ($rootScope, $interval, AuthService) {

                console.log("AS:info: Initting Auth");
                AuthService.refreshSession().then(function() {
                    $interval(AuthService.updateTokenRemainingTime, 1000);
                    $rootScope.$emit('AuthInitted');
                    $rootScope.$broadcast('AuthInitted');
                });

                $rootScope.$on('TokenExpiredError', function(event, args) {
                    console.log("AS:TokenExpired:info:0: Caught token expired error");
                    AuthService.logout();
                });

            }
        ]);
})(angular);

