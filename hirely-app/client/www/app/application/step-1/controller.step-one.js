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

  angular.module('hirelyApp').controller('StepOneController', ['$scope', '$stateParams', 'multiStepFormInstance', 'GeocodeService', 'UserService', 'AuthService' ,StepOneController]);


  function StepOneController($scope, $stateParams, multiStepFormInstance, GeocodeService, UserService, AuthService) {

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
            // console.log(data);
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

        ////reset the user address
        var unit = $scope.user.address.unit;
        $scope.user.address = {};
        $scope.user.address.unit = unit;

        $scope.user.address.lng = place.geometry.location.lng || false;
        $scope.user.address.lat = place.geometry.location.lat || false;
        $scope.user.address.formattedAddress = place.formatted_address || false;

        if(place){
          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            switch (addressType){
              case "route":
                $scope.user.address.street = place.address_components[i][addressComponents[addressType]] || false;
                break;

              case "street_number":
                $scope.user.address.number = place.address_components[i][addressComponents[addressType]] || false;
                break;

              case "country":
                $scope.user.address.country = place.address_components[i][addressComponents[addressType]] || false;
                break;

              case "administrative_area_level_1":
                $scope.user.address.state = place.address_components[i][addressComponents[addressType]] || false;
                break;

              case "locality":
                $scope.user.address.city = place.address_components[i][addressComponents[addressType]] || false;
                break;

              case "postal_code":
                $scope.user.address.zipCode = place.address_components[i][addressComponents[addressType]] || false;
                break;
            }
          }
        }

      });
    }
    // var testUserId = '-444';
    var userID = AuthService.currentUserID;
    var user = angular.copy(AuthService.currentUser);

    if(!$scope.stepOneLoaded){
      // UserService.getUserById(userID).then(function(user){
              // $scope.firstname = user.firstName;
              // $scope.lastname = user.lastName;
              // $scope.email = user.email;
              // $scope.mobile = user.mobile;
              // $scope.address = user.address.formattedAddress;
              // $scope.address_unit = user.address.unit;
              // $scope.address_city = user.address.city;
              // $scope.state = user.address.state;
              // $scope.zipcode = user.address.zipCode;
              $scope.user = user;
              if(false === $scope.user.address) $scope.user.address = {};
              $scope.stepOneLoaded = true;
            // });
    }

    $scope.$on('$destroy', function(){
      console.log($scope.user);
      UserService.createNewUser($scope.user, userID);
    });


  }
})();
