/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  var hirelyApp = angular.module('hirelyApp').controller('StepTwoController', ['$scope', '$stateParams', '$filter', 'GeocodeService', 'OccupationService', 'AuthService', 'UserService', 'StatesNames', StepTwoController]);

  hirelyApp.directive('validateMonth', function(){
    return {
      restrict:'A',
      require:'ngModel',
      link:function(scope, ele, attrs, ctrl){
        ctrl.$parsers.unshift(function(value){
          var m = Number(value);
          var valid = undefined !== m && NaN !== m && m < 13 && m > 0;
          ctrl.$setValidity('invalidMonth', valid)

          return valid ? value : undefined;
        });/// unshift
      }//// fun. link
    }/// return object

  })/// validate month
  .directive('validateYear', function(){
    return {
      restrict:'A',
      require:'ngModel',
      link:function(scope, ele, attrs, ctrl){
        ctrl.$parsers.unshift(function(value){
          var m = Number(value);
          var now = new Date();
          var valid = undefined !== m && NaN != m && m <= now.getFullYear() && m >= 1940;
          ctrl.$setValidity('invalidYear', valid);

          return valid ? value : undefined;
        });/// unshift
      }//// fun. link
    }/// return object

  })/// validate year

  function StepTwoController($scope, $stateParams, $filter, GeocodeService, OccupationService, AuthService, UserService, StatesNames) {

    var geocodeService = GeocodeService;

    /**
     * [orderBy this filter will be used to order the work experience and education array by dateStart]
     */
    var orderBy = $filter('orderBy');

    $scope.stepTwoLoaded = false;

    $scope.programTypes = ['High School Equivalent', 'Associates', 'Bachelors', 'Masters', 'PhD'];

    $scope.states = StatesNames;

    $scope.months = [
      {order:1, name:'Jan'},
      {order:2, name:'Feb'},
      {order:3, name:'Mar'},
      {order:4, name:'Apr'},
      {order:5, name:'May'},
      {order:6, name:'Jun'},
      {order:7, name:'Jul'},
      {order:8, name:'Aug'},
      {order:9, name:'Sep'},
      {order:10, name:'Oct'},
      {order:11, name:'Nov'},
      {order:12, name:'Dec'}
    ];

    /**
     * [eduItems will hold the education data]
     * @type {Array}
     */
    $scope.eduItems = [];

    /**
     * [education will hold a single education data and serve as angular data model
     * this object get filled while user filling the form and cleard after users add it to list of education]
     * @type {Object}
     */
    $scope.education = {};


    /**
     * [xpItems will hold the work experience data]
     * @type {Array}
     */
    $scope.xpItems = [];

    UserService.getUserCompleteFields(AuthService.currentUserID, ['workExperience', 'education'])
    .then(
      function(founded){
        if(Array.isArray(founded.workExperience)){
          /**
           * Work experience is founded
           */
          angular.forEach(founded.workExperience, function(item){
            /**
             * do some dates clenaing and fixing
             */
            item.dateStart = new Date(item.dateStart);
            item.dateEnd = new Date(item.dateEnd);
            item.dateStartYear = item.dateStart.getFullYear();
            item.dateStartMonth = item.dateStart.getMonth() + 1;
            if(!isNaN(item.dateEnd.getTime()) ){
              item.dateEndYear = item.dateEnd.getFullYear();
              item.dateEndMonth = item.dateEnd.getMonth() + 1;
            }
          });
          $scope.xpItems = orderBy(founded.workExperience, 'dateStart', true);
        }//// if isArray(experience)

        if(Array.isArray(founded.education) ){
          /**
           * list of education is found for this user
           */
          angular.forEach(founded.education, function(item){
            item.dateStart = new Date(item.dateStart);
            item.dateStartYear = item.dateStart.getFullYear();
            item.dateStartMonth = item.dateStart.getMonth() + 1;

            if(angular.isDefined(item.dateEnd) ){
              item.dateEnd = new Date(item.dateEnd);
              item.dateEndYear = item.dateEnd.getFullYear();
              item.dateEndMonth = item.dateEnd.getMonth() + 1;
            }

          });//// for each

          $scope.eduItems = orderBy(founded.education, 'dateStart', true);
        }//// if isArray(eduction)

        /**
         * Set step validity if user already has education and experienc
         */
        // $scope.$setValidity($scope.eduItems.length > 0 && $scope.xpItems.length > 0);
        $scope.stepTwoLoaded = true;
      },
      function(err){
        //// console.log(err);
        $scope.stepTwoLoaded = true;
      }
    );//// then



    /**
     * [addJobXp will add new work experience object to array after setting dataStart and dataEnd]
     */
    $scope.addJobXp = function () {
      if(!$scope.stepTwo.$valid) return null;

      var newExp = angular.copy($scope.occupation);
      newExp.dateStart = new Date(Number(newExp.dateStartYear), Number(newExp.dateStartMonth)-1, 1);

      if(true !== newExp.currentlyHere){
        newExp.dateEnd = new Date(Number(newExp.dateEndYear), Number(newExp.dateEndMonth)-1, 1);
      }

      $scope.xpItems.push(newExp);

      $scope.xpItems = orderBy($scope.xpItems, 'dateStart', true);

      $scope.occupation = {};

      $scope.stepTwo.$setUntouched();
      $scope.stepTwo.$setPristine();

      /**
       * Update step validity
       */
      // $scope.$setValidity(true === $scope.eduItems.length > 0 && $scope.xpItems.length > 0);
    }//// fun. addJobXp

    /**
     * [removeJobXp will remove work wperience from the array]
     * @param  {number} index [index of item to be removed]
     * @return {null}       [description]
     */
    $scope.removeJobXp = function(index){
      $scope.xpItems.splice(index, 1);

      /**
       * Update step validity
       */
      // $scope.$setValidity($scope.eduItems.length > 0 && $scope.xpItems.length > 0);
    }

      var locations = [];
      $scope.selectedLocation = undefined;

      /**
       * [searchLocations used for the typeahead in company name, will get the matchin addrss based on entered query]
       * @param  {string} query [text string to search google places for]
       * @return {array}       [array of address objects from google places]
       */
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

      /**
       * [setAddress will set the right address component in scop when user select one address form typeahead]
       * @param {object} address [address object from selected item in typeahead]
       */
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

      /**
       * [searchPosition will be used in typeahead to query onet positions and return a list of matching position]
       * @param  {string} query [string from typeahead text field]
       * @return {array}       [array of matched position form onet api]
       */
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

      /**
       * [setPosition used in typeahead and triggered when user select one of the position in typeahead list]
       * @param {Object} position [description]
       */
      $scope.setPosition = function(reported){
        $scope.occupation.reportedJobName = reported.reportedTitle;
        if(reported.occupations.length === 1){
          $scope.occupation.occupationJobName = reported.occupations[0].occupationTitle;
          $scope.occupation.onetOccupationId = reported.occupations[0].onetId;
        }
        else{
          $scope.positionSub = reported.occupations;
          $scope.stepTwo.position.$setValidity('occupationRequired', false);
        }

      }

      /**
       * [setPositionSub will be called when user select occupation,
       * occupation list will show only if user select reported title related to multi job occupations in onet  ]
       * @param {object} sub [job occupation object selected by user]
       */
      $scope.setPositionSub = function(sub){
        if(sub){
          $scope.occupation.occupationJobName = sub.occupationTitle;
          $scope.occupation.onetOccupationId  = sub.onetId;
          $scope.stepTwo.position.$setValidity('occupationRequired', true);
          delete $scope.positionSub;
        }
      }

      /**
       * Watch dates to make sure end data is greater than start date
       */
       $scope.$watchCollection('[occupation.dateStartYear, occupation.dateStartMonth, occupation.dateEndYear, occupation.dateEndMonth]', function(newValues, oldVaues){
          var start = new Date(Number(newValues[0]), Number(newValues[1])-1, 1);
          var end = new Date(Number(newValues[2]), Number(newValues[3])-1, 1);

          /**
           * check if end date is less than start date
           */
          if( !isNaN(start.getTime() ) && !isNaN(end.getTime() ) ){
            $scope.stepTwo.workDateEndY.$setValidity('invalidEndDate', end > start);
            $scope.stepTwo.workDateEndM.$setValidity('invalidEndDate', end > start);
          }

          /**
           * Check for date conflicts with previous dates
           */
          if(Array.isArray($scope.xpItems))
          for(var x=0; x<$scope.xpItems.length; x++){
            /**
             * check if start date in a middle of range
             */
            if(start >= $scope.xpItems[x].dateStart && start < $scope.xpItems[x].dateEnd){
              $scope.stepTwo.workDateStartY.$setValidity('startDateConflict', false);
              $scope.stepTwo.workDateStartM.$setValidity('startDateConflict', false);
              $scope.xpItems[x].conflict = true;
              break;
            }
            else{
              $scope.stepTwo.workDateStartY.$setValidity('startDateConflict', true);
              $scope.stepTwo.workDateStartM.$setValidity('startDateConflict', true);
              $scope.xpItems[x].conflict = false;
            }

            /**
             * check if end date in a middle of range
             */
            if(end > $scope.xpItems[x].dateStart && end <= $scope.xpItems[x].dateEnd){
              $scope.stepTwo.workDateEndY.$setValidity('endDateConflict', false);
              $scope.stepTwo.workDateEndM.$setValidity('endDateConflict', false);
              $scope.xpItems[x].conflict = true;
              break;
            }
            else{
              $scope.stepTwo.workDateEndY.$setValidity('endDateConflict', true);
              $scope.stepTwo.workDateEndM.$setValidity('endDateConflict', true);
              $scope.xpItems[x].conflict = false;
            }

            /**
             * Check if new rang is overlap one old rag
             */
            if(start <= $scope.xpItems[x].dateStart && end >= $scope.xpItems[x].dateEnd){
              $scope.stepTwo.workDateEndY.$setValidity('endDateConflict', false);
              $scope.stepTwo.workDateEndM.$setValidity('endDateConflict', false);
              $scope.stepTwo.workDateStartY.$setValidity('startDateConflict', false);
              $scope.stepTwo.workDateStartM.$setValidity('startDateConflict', false);
              $scope.xpItems[x].conflict = true;
              break;
            }
            else{
              $scope.stepTwo.workDateEndY.$setValidity('endDateConflict', true);
              $scope.stepTwo.workDateEndM.$setValidity('endDateConflict', true);
              $scope.stepTwo.workDateStartY.$setValidity('startDateConflict', true);
              $scope.stepTwo.workDateStartM.$setValidity('startDateConflict', true);
              $scope.xpItems[x].conflict = false;
            }

          }//// for
       });//// $watch

      /**
       * [addEducation will save education form to education list, order the education by dateStart and clear the form for next save
       * this function will be trigger by click of "Save Education" button ]
       */
      $scope.addEducation = function(){
        if(!$scope.stepTwoE.$valid) return null;

        var newEdu = angular.copy($scope.education);

        newEdu.dateStart = new Date(Number(newEdu.dateStartYear), Number(newEdu.dateStartMonth)-1, 1);

        if(true !== newEdu.currentlyEnrolled){
          newEdu.dateEnd = new Date(Number(newEdu.dateEndYear), Number(newEdu.dateEndMonth)-1, 1);
        }

        newEdu.isOnline = !!newEdu.isOnline;

        newEdu.isCompleted = !newEdu.currentlyEnrolled;

        $scope.eduItems.push(newEdu);

        $scope.eduItems = orderBy($scope.eduItems, 'dateStart', true);

        $scope.education = {};

        $scope.stepTwoE.$setUntouched();
        $scope.stepTwoE.$setPristine();

        /**
         * Update step validity
         */
        // $scope.$setValidity($scope.eduItems.length > 0 && $scope.xpItems.length > 0);
      }

      /**
       * [removeEducation will remove one education entry from education list Array by entry index]
       * @param  {Number} index [index of array to be removed]
       * @return {[type]}       [description]
       */
      $scope.removeEducation = function(index){
        $scope.eduItems.splice(index, 1);

        /**
         * Update step validity
         */
        // $scope.$setValidity($scope.eduItems.length > 0 && $scope.xpItems.length > 0);
      }

      /**
       * Watch education dates to make sure end data is greater than start date
       */
       $scope.$watchCollection('[education.dateStartYear, education.dateStartMonth, education.dateEndYear, education.dateEndMonth]', function(newValues, oldVaues){
          var start = new Date(Number(newValues[0]), Number(newValues[1])-1, 1);
          var end = new Date(Number(newValues[2]), Number(newValues[3])-1, 1);

          /**
           * check if end date is less than start date
           */
          if(true !== $scope.education.currentlyEnrolled && !isNaN(start.getTime() ) && !isNaN(end.getTime() ) ){
            $scope.stepTwoE.eduDateEndY.$setValidity('invalidEndDate', end > start);
            $scope.stepTwoE.eduDateEndM.$setValidity('invalidEndDate', end > start);
          }

          /**
           * Check for date conflicts with previous dates
           */
          if(Array.isArray($scope.eduItems))
          for(var x=0; x<$scope.eduItems.length; x++){
            /**
             * check if start date in a middle of range
             */
            if(start >= $scope.eduItems[x].dateStart && start < $scope.eduItems[x].dateEnd){
              $scope.stepTwoE.eduDateStartY.$setValidity('startDateConflict', false);
              $scope.stepTwoE.eduDateStartM.$setValidity('startDateConflict', false);
              $scope.eduItems[x].conflict = true;
              break;
            }
            else{
              $scope.stepTwoE.eduDateStartY.$setValidity('startDateConflict', true);
              $scope.stepTwoE.eduDateStartM.$setValidity('startDateConflict', true);
              $scope.eduItems[x].conflict = false;
            }

            /**
             * check if end date in a middle of range
             */
            if(end > $scope.eduItems[x].dateStart && end <= $scope.eduItems[x].dateEnd){
              $scope.stepTwoE.eduDateEndY.$setValidity('endDateConflict', false);
              $scope.stepTwoE.eduDateEndM.$setValidity('endDateConflict', false);
              $scope.eduItems[x].conflict = true;
              break;
            }
            else{
              $scope.stepTwoE.eduDateEndY.$setValidity('endDateConflict', true);
              $scope.stepTwoE.eduDateEndM.$setValidity('endDateConflict', true);
              $scope.eduItems[x].conflict = false;
            }

            /**
             * Check if new rang is overlap one old range
             */
            if(start <= $scope.eduItems[x].dateStart && end >= $scope.eduItems[x].dateEnd){

              $scope.stepTwoE.eduDateEndY.$setValidity('endDateConflict', false);
              $scope.stepTwoE.eduDateEndM.$setValidity('endDateConflict', false);

              $scope.stepTwoE.eduDateStartY.$setValidity('startDateConflict', false);
              $scope.stepTwoE.eduDateStartM.$setValidity('startDateConflict', false);
              $scope.eduItems[x].conflict = true;
              break;
            }
            else{

              $scope.stepTwoE.eduDateEndY.$setValidity('endDateConflict', true);
              $scope.stepTwoE.eduDateEndM.$setValidity('endDateConflict', true);
              $scope.stepTwoE.eduDateStartY.$setValidity('startDateConflict', true);
              $scope.stepTwoE.eduDateStartM.$setValidity('startDateConflict', true);
              $scope.eduItems[x].conflict = false;
            }

          }//// for
       });//// $watch


      /**
       * Save the entries to database on scope destroy]
       */
      $scope.$on('$destroy', function(){
        /**
         * Make sure user is authenticated
         */
        AuthService.getAuth()
        .then(
          function(isAuth){
            /**
             * User is authenticated
             * do save
             */
            if(isAuth){
              var toSave = {
                workExperience:angular.copy($scope.xpItems),
                education:angular.copy($scope.eduItems)
              };
              UserService.saveUser(toSave, AuthService.currentUserID)
              .then(
                function(user){
                  // console.log(user);
                },
                function(err){
                  alert("Error!\nYour data was not saved, please try again.")
                  console.log(err);
                }
              )
            }//// if isAuth
            else{

            }//// if isAuth else
          }//// reslove
        )//// getAuth.then()
      })/// $on.$destroy

  }
})();