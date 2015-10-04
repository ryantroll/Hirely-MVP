(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$state', '$stateParams', 'GeocodeService', HomeCtrl ]);

    function HomeCtrl ($scope, $state, $stateParams, GeocodeService) {
        var geocodeService = GeocodeService;

        $scope.flexSliderOptions = {
            animation: "fade",
            directionNav: false,
            controlNav: false,
            slideshowSpeed: 10000
        };

        $scope.results = '';
        $scope.options = {
            types: '(regions)'
        };
        $scope.details = '';

        var place = geocodeService.getPlace();
        if(place){

            $scope.results = place.formatted_address;
            $scope.details = place;
        }

        $scope.getResults = function() {
            geocodeService.setPlace($scope.details);
            $state.go('app.job', {placeId: $scope.details.place_id})

        }


    }
})();
