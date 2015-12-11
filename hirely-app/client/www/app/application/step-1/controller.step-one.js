/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 *
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('StepOneController', ['$scope', '$stateParams', 'multiStepFormInstance', 'GeocodeService', StepOneController]);


  function StepOneController($scope, $stateParams, multiStepFormInstance, GeocodeService) {

    var geocodeService = GeocodeService;

    $scope.validStep = false;

    var addressComponents = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };



    $scope.$watch('stepOne.$valid', function(state) {
      multiStepFormInstance.setValidity(state);
    });

    var locations = [];
    $scope.selectedLocation = undefined;

    $scope.searchLocations = function(query){
      if(!!query && query.trim() != ''){
        return geocodeService.geoCodeAddress(query).then(function(data){
          locations = [];
          if(data.statusCode == 200){
            console.log(data);
            data.results.predictions.forEach(function(prediction){
              locations.push({address: prediction.description, placeId: prediction.place_id});
            });
            return locations;
          } else {
            return {};
          }
        });
      }
    };

    $scope.setAddress = function(address){
      geocodeService.getPlaceDetails(address.placeId).then(function(data){
        var place = data.results.result;
        if(place){
          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            switch (addressType){
              case "administrative_area_level_1":
                $scope.state = place.address_components[i][addressComponents[addressType]];
                break;

              case "locality":
                $scope.address_city = place.address_components[i][addressComponents[addressType]];
                break;

              case "postal_code":
                $scope.zipcode = place.address_components[i][addressComponents[addressType]];
                break;
            }
          }
        }
      });
    }


  }
})();