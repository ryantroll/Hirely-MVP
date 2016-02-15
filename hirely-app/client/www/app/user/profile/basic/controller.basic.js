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

  angular.module('hirelyApp').controller('ProfileBasicController', ['$scope', '$stateParams', 'multiStepFormInstance', 'GeocodeService', 'UserService', 'AuthService', '$timeout', ProfileBasicController])
  .directive('validateDate', function(){
    return {
      restrict:'A',
      require:'ngModel',
      link:function(scope, ele, attrs, ctrl){
        ctrl.$parsers.unshift(function(value){
          var pat = /^\d{2}\/\d{2}\/\d{4}$/;
          var valid = true;

          valid = valid && pat.test(value);
          if(false === valid){
            ctrl.$setValidity('invalidDate', false)
            return value;
          }

          var dateParts = value.split('/');
          var D = Date.parse(dateParts[2]+"-"+dateParts[0]+"-"+dateParts[1]);
          var now = new Date();

          if(isNaN(D)){
            ctrl.$setValidity('invalidDate', false)
            return value;
          }

          D = new Date(D);

          if(D >= now){
            ctrl.$setValidity('invalidDate', false)
            return value;
          }

          ctrl.$setValidity('invalidDate', true);
          return value;
        });/// unshift
      }//// fun. link
    }/// return object
  })/// validate date;
  .directive('validatePhone', function(){
    return {
      restrict:'A',
      require:'ngModel',
      link:function(scope, ele, attrs, ctrl){
        ctrl.$parsers.unshift(function(value){
          var pat = /^((\(\d{3}\))|(\d{3})) ?\d{3}(\-| )?\d{4}$/;

          if(false === pat.test(value)){
            ctrl.$setValidity('invalidPhone', false);
            return value;
          }

          ctrl.$setValidity('invalidPhone', true);
          return value;
        });/// unshift
      }//// fun. link
    }/// return object
  })/// validate date;
  .directive('validateZipcode', function(){
    return {
      restrict:'A',
      require:'ngModel',
      link:function(scope, ele, attrs, ctrl){
        ctrl.$parsers.unshift(function(value){
          scope.searchLocations(value)
          .then(
            function(locations){
              console.log(locations);
            },
            function(err){
              console.log(err)
            }
          )
          return value;
        });/// unshift
      }//// fun. link
    }/// return object
  })/// validate date;


  function ProfileBasicController($scope, $stateParams, multiStepFormInstance, GeocodeService, UserService, AuthService, $timeout) {

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

    /**
     * [formatPhone Will set the right format for phone while the user typing in]
     */
    $scope.formatPhone = function(){
      var newVal = $scope._mobile;

      if(newVal === false || angular.isUndefined(newVal)) return;

      $scope._mobile = UserService.formatPhone(newVal);
    };

    $scope.formatDate = function(){
      var newVal = angular.copy($scope._dateOfBirth);
      if(newVal === null || angular.isUndefined(newVal)) return;

      //// clear date format
      newVal = newVal.split('/').join('');

      var formated = '';
      if(newVal.length >= 2){
        formated += newVal.slice(0,2) + '/';
        newVal = newVal.slice(2);
      }
      if(newVal.length >= 2){
        formated += newVal.slice(0,2) + '/';
        newVal = newVal.slice(2);
      }
      formated += newVal;

      $scope._dateOfBirth = formated;
    }//// fun. formatDate

    /**
     *
     */


    // var locations = [];
    // $scope.selectedLocation = undefined;

    // $scope.searchLocations = function(query){
    //   if(!!query && query.trim() != ''){

    //     return geocodeService.geoCodeAddress(query)
    //     .then(
    //       function(data){
    //         locations = [];
    //         if(data.statusCode == 200){
    //           data.results.predictions.forEach(function(prediction){
    //             locations.push({address: prediction.description, placeId: prediction.place_id});
    //           });
    //           return locations;
    //         } //// if statusCode == 200
    //         else {
    //           console.dir('error', data.statusCode);
    //           return {};
    //         }
    //       },//// fun. reslove
    //       function(error){
    //         console.dir(error);
    //       }/// fun. reject
    //     );//// then
    //   }//// if query
    // };/// fun. searchLocations

    // $scope.setAddress = function(address){
    //   $scope.user.googlePlaceId = address.placeId;
    //   geocodeService.getPlaceDetails(address.placeId).then(function(data){
    //     var place = data.results.result;

    //     if(place){

    //       /**
    //        * Loop throught  address components and take what is needed
    //        */
    //       for (var i = 0; i < place.address_components.length; i++) {
    //         var addressType = place.address_components[i].types[0];
    //         switch (addressType){
    //           case "route":
    //             $scope.user.street1 = place.address_components[i][addressComponents[addressType]] || false;
    //             break;

    //           // case "street_number":
    //           //   $scope.user.number = place.address_components[i][addressComponents[addressType]] || false;
    //           //   break;

    //           case "country":
    //             $scope.user.country = place.address_components[i][addressComponents[addressType]] || false;
    //             break;

    //           case "administrative_area_level_1":
    //             $scope.user.state = place.address_components[i][addressComponents[addressType]] || false;
    //             break;

    //           case "locality":
    //             $scope.user.city = place.address_components[i][addressComponents[addressType]] || false;
    //             break;

    //           case "postal_code":
    //             $scope.user.postalCode = place.address_components[i][addressComponents[addressType]] || false;
    //             break;
    //         }//// switch
    //       }//// for

    //       $scope.user.lng = place.geometry.location.lng || null;
    //       $scope.user.lat = place.geometry.location.lat || null;
    //       $scope.user.formattedAddress = place.formatted_address || null;
    //       $scope.user.street1 = place.name;
    //       // $scope.user.neighbourhood = place.vicinity;

    //     }//// if place

    //   });
    // }//// fun. setAddress




    /**
     * Waite for 1 sec to check the stepOnLoaded
     * waiting time is adde dto prevent the undefined value for this var that happen occasionally
     */
    $timeout(function(){
      if(!$scope.stepOneLoaded){
        $scope.user = angular.copy(AuthService.currentUser);
        /**
         * Set scope _dateOfBirth and _mobile these 2 properites need to be fomrated before display
         */
        if ($scope._mobile) {
          $scope._mobile = UserService.formatPhone($scope.user.mobile.split('+1.').join(''));
        } else {
          $scope._mobile = '';
        }
        $scope._dateOfBirth = UserService.formatDate($scope.user.dateOfBirth);

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
              /**
               * do some data clean up
               */
              $scope.user.dateOfBirth = new Date($scope._dateOfBirth);
              $scope.user.mobile = '+1.' + UserService.clearPhoneFormat($scope._mobile);

              /**
               * Save only basic information
               */


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
