    /**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("mean.hirely.shared").directive('flexslider', function () {

    return {
        restrict: 'A',
        scope: {
            options: '=?'
        },
        link: function (scope, element, attrs) {

            $(element[0]).flexslider(scope.options);
        }
    }
});
