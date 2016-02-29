/**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.layout").directive("header", function() {
    return {
        restrict: 'A',
        // templateUrl: 'app/layout/header.html',
        templateUrl: 'app/layout/application/application-header.tpl.html',
        // controller: 'HeaderCtrl',
        controller: 'ApplicationHeaderController',
        scope: true,
        transclude : false
    };
});