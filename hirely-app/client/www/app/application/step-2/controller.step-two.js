/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('StepTwoController', ['$scope', '$stateParams', 'GeocodeService', 'OccupationService', StepTwoController]);


  function StepTwoController($scope, $stateParams, GeocodeService, OccupationService) {

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
          $scope.occupation.formattedAddress = address.address;
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
                          // case "route":
                              // $scope.occupation.street1 = place.address_components[i][addressComponents[addressType]] || false;
                              // break;

                          // case "street_number":
                          //   $scope.user.number = place.address_components[i][addressComponents[addressType]] || false;
                          //   break;

                          // case "country":
                          //     $scope.occupation.country = place.address_components[i][addressComponents[addressType]] || false;
                          //     break;

                          case "administrative_area_level_1":
                              $scope.occupation.state = place.address_components[i].short_name || null;
                              break;

                          case "locality":
                              $scope.occupation.city = place.address_components[i].long_name || null;
                              break;

                          // case "postal_code":
                          //     $scope.occupation.postalCode = place.address_components[i][addressComponents[addressType]] || false;
                          //     break;
                      }//// switch
                  }//// for

              }//// if place

          });

      }//// fun. setAddress

      $scope.searchPosition = function(query){
        if(query.trim().length > 1){
          return OccupationService.getOccupations(query)
          .then(
            function(data){
              if(200 === data.statusCode){
                var occupations = data.results;
                return occupations;
              }
              else{
                console.log(data.statusCode);
                return [];
              }
            },
            function(err){
              console.log(err);
              return [];
            }
          )
        }//// if query
        else{
          return [];
        }
      }//// fun. searchPositions

      $scope.setPosition = function(position){
        $scope.occupation.reportedJobName = position.title;
        $scope.occupation.onetOccupationId
      }

  }
})();