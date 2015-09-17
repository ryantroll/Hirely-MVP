(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$state', '$stateParams', 'GeocodeService', HomeCtrl ]);

    function HomeCtrl ($scope, $state, $stateParams, GeocodeService) {
        var geocodeService = GeocodeService;

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
            $state.go('appFS.job', {placeId: $scope.details.place_id})

        }

    }
})();
