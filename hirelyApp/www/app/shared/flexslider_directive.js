    /**
 * Created by labrina.loving on 8/6/2015.
 */
angular.module("hirelyApp.shared").directive('flexslider', function () {

    return {
        link: function (scope, element, attrs) {

            $('#bg-slider').flexslider({
                animation: "fade",
                directionNav: false, //remove the default direction-nav - https://github.com/woothemes/FlexSlider/wiki/FlexSlider-Properties
                controlNav: false, //remove the default control-nav
                slideshowSpeed: 10000
            });
        }
    }
});
