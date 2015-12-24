/**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("mean.hirely.layout").directive("footer", function() {
    return {
        restrict: 'A',
        templateUrl: 'app/layout/footer.html',
        scope: true,
        transclude : false
    };
});