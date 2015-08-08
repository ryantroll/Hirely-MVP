/**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.layout").directive("header", function() {
    return {
        restrict: 'A',
        templateUrl: 'app/layout/header.html',
        controller: 'HeaderCtrl',
        scope: true,
        transclude : false
    };
});