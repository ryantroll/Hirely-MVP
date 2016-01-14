/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('StepTwoController', ['$scope', '$stateParams', 'GeocodeService', StepTwoController]);


  function StepTwoController($scope, $stateParams, GeocodeService) {

    var geocodeService = GeocodeService;

    $scope.xpItems = [];
    $scope.addJobXp = function () {
      console.log($scope.company);
      $scope.xpItems.push(
        {
          company: $scope.company,
          position: $scope.position,
          description: $scope.description
        }
      )
    }

      var locations = [];
      $scope.selectedLocation = undefined;

      $scope.searchLocations = function(query){
          if(!!query && query.trim() != ''){

              return geocodeService.placeSearch(query)
                  .then(
                      function(data){
                          locations = [];
                          if(data.statusCode == 200){
                              data.results.predictions.forEach(function(prediction){
                                  locations.push({address: prediction.description, placeId: prediction.place_id});
                              });
                              return locations;
                          } //// if statusCode == 200
                          else {
                              console.dir('error', data.statusCode);
                              return {};
                          }
                      },//// fun. reslove
                      function(error){
                          console.dir(error);
                      }/// fun. reject
                  );//// then
          }//// if query
      };/// fun. searchLocations

      $scope.setAddress = function(address){
          $scope.occupation.googlePlaceId = address.placeId;
          geocodeService.getPlaceDetails(address.placeId).then(function(data){
              var place = data.results.result;

              if(place){

                  /**
                   * Loop throught  address components and take what is needed
                   */
                  for (var i = 0; i < place.address_components.length; i++) {
                      var addressType = place.address_components[i].types[0];
                      switch (addressType){
                          case "route":
                              $scope.occupation.street1 = place.address_components[i][addressComponents[addressType]] || false;
                              break;

                          // case "street_number":
                          //   $scope.user.number = place.address_components[i][addressComponents[addressType]] || false;
                          //   break;

                          case "country":
                              $scope.occupation.country = place.address_components[i][addressComponents[addressType]] || false;
                              break;

                          case "administrative_area_level_1":
                              $scope.occupation.state = place.address_components[i][addressComponents[addressType]] || false;
                              break;

                          case "locality":
                              $scope.occupation.city = place.address_components[i][addressComponents[addressType]] || false;
                              break;

                          case "postal_code":
                              $scope.occupation.postalCode = place.address_components[i][addressComponents[addressType]] || false;
                              break;
                      }//// switch
                  }//// for

                  $scope.occupation.lng = place.geometry.location.lng || null;
                  $scope.occupation.lat = place.geometry.location.lat || null;
                  $scope.occupation.formattedAddress = place.formatted_address || null;
                  $scope.occupation.street1 = place.name;
                  // $scope.user.neighbourhood = place.vicinity;

              }//// if place

          });
      }//// fun. setAddress

  }
})();