(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$state', HomeCtrl ]);

    function HomeCtrl ($scope, $state) {


        $scope.flexSliderOptions = {
            animation: "fade",
            directionNav: false,
            controlNav: false,
            slideshowSpeed: 10000
        };

        angular.element('.search-container').addClass('animated fadeInUp');

        angular.element('.search-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            angular.element('.search-container').removeClass('animated fadeInUp');
        });


        var locations = [];
        $scope.selectedLocation = undefined;


        $scope.searchLocations = function(query){
            if(!!query && query.trim() != ''){
                return geocodeService.getCityBySearchQuery(query).then(function(data){
                    locations = [];
                    if(data.statusCode == 200){
                        data.results.predictions.forEach(function(prediction){
                            locations.push({address: prediction.description, placeId: prediction.id});
                        });
                        return locations;
                    } else {
                        return {};
                    }
                });
            }
        };

            //var place = geocodeService.getPlace();
        //if(place){
        //
        //    $scope.results = place.formatted_address;
        //    $scope.details = place;
        //}
        //
        $scope.getResults = function() {
            if(!!$scope.selectedLocation){
                geocodeService.setPlace($scope.selectedLocation);
                $state.go('master.default.job', {placeId: $scope.selectedLocation.placeId});
            }
            else {
                console.log('no!');
                angular.element('.search-container').addClass('animated shake');
                angular.element('.search-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    angular.element('.search-container').removeClass('animated shake');
                });
            }

        };


    }
})();
