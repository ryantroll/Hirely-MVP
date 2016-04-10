(function (angular) {
    "use strict";

    angular.module('hirelyApp.core')
        .run(['$rootScope',
            function ($rootScope) {
                if (angular.isUndefined($rootScope.nextState)) {
                    $rootScope.nextState = [];
                }
            }
        ]);
})(angular);

