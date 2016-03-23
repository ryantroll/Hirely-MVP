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

  angular.module('hirelyApp').controller('ProfileBasicController', ['$scope', '$rootScope', '$stateParams', 'multiStepFormInstance', 'GeocodeService', 'UserService', 'AuthService', '$timeout', 'FileUpload', 'DEFAULT_PROFILE_IMAGE', ProfileBasicController])
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
  .directive('file', function() {
    return {
      restrict: 'AE',
      scope: {
        file: '@'
      },
      link: function(scope, el, attrs){
        el.bind('change', function(event){
          var files = event.target.files;
          var file = files[0];
          scope.file = file;
          scope.$parent.file = file;
          scope.$apply();
          scope.$parent.uploadPhoto();
        });
      }
    };
  });


  function ProfileBasicController($scope, $rootScope, $stateParams, multiStepFormInstance, GeocodeService, UserService, AuthService, $timeout, FileUpload, DEFAULT_PROFILE_IMAGE) {

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
        $scope.user = angular.copy(AuthService.getCurrentUser());

        if (!$scope.user) {
          return;
        }

        /**
         * Set scope _dateOfBirth and _mobile these 2 properites need to be fomrated before display
         */
        if($scope.user.mobile){
          $scope._mobile = UserService.formatPhone($scope.user.mobile.split('+1.').join(''));
        }
        if($scope.user.dateOfBirth){
          $scope._dateOfBirth = UserService.formatDate($scope.user.dateOfBirth);
        }

        if(!$scope.user.profileImageURL){
          $scope.user.profileImageURL = DEFAULT_PROFILE_IMAGE;
        }

        $scope.stepOneLoaded = true;
      }
    }, 1000);/// $timeout




    //// wait for destroy event to update data
    $scope.$on('$destroy', function(event){
      /**
       * Make sure user is logged in before you do update
       */
      if(AuthService.isUserLoggedIn() && $scope.stepOneLoaded){
        /**
         * User is authenticated update user data
         */
        // TODO:  Upsert application to business once BusinessService is ready
        /**
         * do some data clean up
         */
        if($scope._dateOfBirth){
          $scope.user.dateOfBirth = new Date($scope._dateOfBirth);
        }
        if($scope._mobile){
          $scope.user.mobile = '+1.' + UserService.clearPhoneFormat($scope._mobile);
        }

        /**
         * Save only basic information
         */


        var toSave = {
          _id: $scope.user._id,
          profileImageURL: $scope.user.profileImageURL,
          mobile: $scope.user.mobile,
          dateOfBirth: $scope.user.dateOfBirth,
          postalCode: $scope.user.postalCode
        };
        UserService.saveUser(toSave)
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
      }////

    });

    $scope.selectFile = function(){
      angular.element('#photoFile').show().focus().click();
    }//// selectFile

    $rootScope.$on('UploadProgress', function(event, per){
      var percent = Math.round(per * 100);
      angular.element('.image-loader').text(percent);
    })

    $scope.uploadPhoto = function(){
      angular.element('.image-loader').show();

      if(angular.isUndefined($scope.file)){
        return null;
      }

      var fileName = $scope.file.name.split('.');
      var ext = fileName.pop();
      fileName = fileName.join('.');
      fileName += '-pofile-' + AuthService.currentUserID + '.' + ext;

      FileUpload.putFile($scope.file, fileName, 'profile-photos')
      .then(
        function(fileUrl){
          $scope.user.profileImageURL = fileUrl;
          var userToSave = angular.copy(AuthService.getCurrentUser());
          userToSave.profileImageURL = fileUrl;
          return UserService.saveUser(userToSave)
        },
        function(err){
          console.log(err);
          return null;
        }
      )///
      .then(
        function(savedUser){
          // console.log(savedUser);
          AuthService.updateCurrentUser(savedUser);

          delete $scope.file;
          angular.element('#photoFile').val(null);
          angular.element('.image-loader').hide();
        },
        function(err){
          console.log(err)
        }
      )
    }//// fun. uploadPhoto

    $scope.removeImage = function(){
      var userToSave = angular.copy(AuthService.currentUser);
      userToSave.profileImageURL = null;
      $scope.user.profileImageURL = DEFAULT_PROFILE_IMAGE;
      UserService.saveUser(userToSave)
      .then(
        function(savedUser){
          // console.log(savedUser);
          AuthService.updateCurrentUser(savedUser);
        },
        function(err){
          console.log(err)
        }
      );/// .then
    }//// fun. removeImage


  }
})();
