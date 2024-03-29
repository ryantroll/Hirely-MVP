/**
 * Created by labrina.loving on 8/9/2015.
 */
angular.module('hirelyApp.core')
    .config(['$provide', function($provide) {
        // adapt ng-cloak to wait for auth before it does its magic
        $provide.decorator('ngCloakDirective', ['$delegate', 'Auth',
            function($delegate, Auth) {
                var directive = $delegate[0];
                // make a copy of the old directive
                var _compile = directive.compile;
                directive.compile = function(element, attr) {
                    Auth.$waitForAuth().then(function() {
                        // after auth, run the original ng-cloak directive
                        _compile.call(directive, element, attr);
                    });
                };
                // return the modified directive
                return $delegate;
            }]);
    }]);
