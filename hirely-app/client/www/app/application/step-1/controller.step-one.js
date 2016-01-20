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

  angular.module('hirelyApp').controller('StepOneController', ['$scope', '$stateParams', 'multiStepFormInstance', 'GeocodeService', 'UserService', 'AuthService', '$timeout', StepOneController]);


  function StepOneController($scope, $stateParams, multiStepFormInstance, GeocodeService, UserService, AuthService, $timeout) {

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

        return geocodeService.geoCodeAddress(query)
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
      $scope.user.googlePlaceId = address.placeId;
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
                $scope.user.street1 = place.address_components[i][addressComponents[addressType]] || false;
                break;

              // case "street_number":
              //   $scope.user.number = place.address_components[i][addressComponents[addressType]] || false;
              //   break;

              case "country":
                $scope.user.country = place.address_components[i][addressComponents[addressType]] || false;
                break;

              case "administrative_area_level_1":
                $scope.user.state = place.address_components[i][addressComponents[addressType]] || false;
                break;

              case "locality":
                $scope.user.city = place.address_components[i][addressComponents[addressType]] || false;
                break;

              case "postal_code":
                $scope.user.postalCode = place.address_components[i][addressComponents[addressType]] || false;
                break;
            }//// switch
          }//// for

          $scope.user.lng = place.geometry.location.lng || null;
          $scope.user.lat = place.geometry.location.lat || null;
          $scope.user.formattedAddress = place.formatted_address || null;
          $scope.user.street1 = place.name;
          // $scope.user.neighbourhood = place.vicinity;

        }//// if place

      });
    }//// fun. setAddress




    /**
     * Waite for 1 sec to check the stepOnLoaded
     * waiting time is adde dto prevent the undefined value for this var that happen occasionally
     */
    $timeout(function(){
      if(!$scope.stepOneLoaded){
        $scope.user = angular.copy(AuthService.currentUser);
        $scope.stepOneLoaded = true;
      }
    }, 1000);/// $timeout


    //// wait for destroy event to update data
    $scope.$on('$destroy', function(event){
      /**
       * Make sure user is logged in before you do update
       */
      AuthService.getAuth().then(
        /**
         * user is logged in go ahead and do data update
         */
        function(result){
            if(true === result){
              /**
               * User is authenticated update user data
               */
              // TODO:  Upsert application to business once BusinessService is ready
              UserService.saveUser($scope.user, AuthService.currentUserID)
              .then(
                function(savedUser){
                  /**
                   * User data updated successfully
                   */

                  //// make sure the AuthService data is synced
                  AuthService.updateCurrentUser($scope.user);
                },//// fun. resolve
                function(err){
                  /**
                   * Error in updateing user data
                   */

                  alert('Error!\nSomething wrong happened while saving data.');
                }//// fun. reject
              );//// saveUser then
            }//// if getAuth
            else{
              /**
               * Error in getAuth
               */
              console.log(result);
              alert(result);
            }//// if true else

        },///// resolve funtion
        function(err){
          /**
           * User is not logged id do do anything
           */

        }//// fun. getAuth Reject
      );/// getAuth promise

    });

  }
})();
