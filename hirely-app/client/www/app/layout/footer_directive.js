/**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.layout").directive("footer", function() {
    return {
        restrict: 'A',
        templateUrl: 'app/layout/footer.html',
        scope: true,
        transclude : false
    };
});