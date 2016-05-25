/**
 * Created by bdombro on 5/25/16.
 */

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-77928232-2', 'auto');
//    ga('send', 'pageview');

(function (angular) {
    "use strict";

    angular.module('hirelyApp.core')
        .run(['$rootScope', "$location",
            function ($rootScope, $location) {

                var lastUrl = null;
                $rootScope.$on('$viewContentLoaded', function(event) {
                    // $window could be used to access ga
                    // $window.ga('send', 'pageview', { page: $location.url() });
                    if ($location.url() != lastUrl) {
                        ga('send', 'pageview', {page: $location.url()});
                        lastUrl = $location.url();
                    }
                });

            }
        ]);
})(angular);

