/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  var hirelyApp = angular.module('hirelyApp').controller('ProfileExperienceController', ['$scope', '$stateParams', '$filter', '$timeout', 'GeocodeService', 'OccupationService', 'AuthService', 'UserService', 'StatesNames', ProfileExperienceController]);

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
    }; /// return object

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
    }; /// return object

  }); /// validate year

  function ProfileExperienceController($scope, $stateParams, $filter, $timeout, GeocodeService, OccupationService, authService, userService, StatesNames) {

    var geocodeService = GeocodeService;

    $scope.requireWorkOccupationValidation = false;

    /**
     * [orderBy this filter will be used to order the work experience and education array by dateStart]
     */
    var orderBy = $filter('orderBy');

    $scope.stepTwoLoaded = false;

    $scope.states = StatesNames;

    $scope.occupation = {};

    $scope.workExperienceChanged = false;

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


    $timeout(function() {
      window.scrollTo(0 ,0);
    });

    /**
     * [xpItems will hold the work experience data]
     * @type {Array}
     */
    $scope.xpItems = [];

    userService.getUserCompleteFields(authService.currentUserID, ['workExperience'])
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
            item.dateStartYear = item.dateStart.getFullYear();
            item.dateStartMonth = String(item.dateStart.getMonth() + 1);

            if (item.currentlyHere != true) {
              item.dateEnd = new Date(item.dateEnd);
            }

          });
          $scope.xpItems = orderBy(founded.workExperience, 'dateStart', true);
        }//// if isArray(experience)

        $timeout(function(){
          if(!$scope.stepOneLoaded){
            $scope.stepTwoLoaded = true;
          }
        }, 1000);/// $timeout

      },
      function(err){
        //// console.log(err);
        $scope.stepTwoLoaded = true;
      }
    );//// then


    /**
     * [customDebounce is used to debounce inputs, thereby waiting to call a callback until the activity stops X ms.
     * Can be called like so:  $scope.customDebounce(callback, ms)]
     */
    $scope.customDebounce = (function(){
      var timer = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();


    /**
     * [addJobXp will add new work experience object to array after setting dataStart and dataEnd]
     */
    $scope.addJobXp = function () {
      if(!$scope.stepTwo.$valid) return null;

      /**
       * Check if edit
       */
      if(angular.isDefined($scope.editIndex)
        && $scope.editIndex >=0
        && $scope.editIndex < $scope.xpItems.length
      ){
        console.log($scope.editIndex, $scope.editIndex > 0);
        $scope.occupation.dateStart = new Date(Number($scope.occupation.dateStartYear), Number($scope.occupation.dateStartMonth)-1, 1);

        if(true !== $scope.occupation.currentlyHere){
          $scope.occupation.dateEnd = new Date(Number($scope.occupation.dateEndYear), Number($scope.occupation.dateEndMonth)-1, 1);
        }
        angular.extend($scope.xpItems[$scope.editIndex], $scope.occupation);

        $scope.occupation = {};
        delete $scope.editIndex;

        // $scope.xpItems = orderBy($scope.xpItems, 'dateStart', true);

        $scope.stepTwo.$setUntouched();
        $scope.stepTwo.$setPristine();

        $scope.addWorkXpForm = false;
        $scope.workExperienceChanged = true;
        return;
      }//// if edit;

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

      $scope.addWorkXpForm = false;
      $scope.workExperienceChanged = true;
    }; //// fun. addJobXp

    /**
     * [fixFormDiv will set the form div to window height and scroll page to top
     * form is shown as an overlay and should cover the whole screen]
     * @return {null}
     */
    function fixFormDiv(divId){
      var formDiv = $(divId);
      $(window).scrollTop(0);
      /**
       * Add some delay so we can read the height property after div is added to dom
       */
      setTimeout(function(){
        if(formDiv.height() < $(document).height()){
          formDiv.height($(document).height());
        }
      },100)
    }

    /**
     * [removeJobXp will remove work wperience from the array]
     * @param  {number} index [index of item to be removed]
     * @return {null}       [description]
     */
    $scope.removeJobXp = function(index){
      $scope.xpItems.splice(index, 1);
      $scope.workExperienceChanged = true;
    };

    /**
     * [editJobXp will show the form after setting the occupatin scope var to holde the edited item]
     * @param  {number} index [index of edited item in xpItems array ]
     * @return {null}       [description]
     */
    $scope.editJobXp = function(index){
      $scope.occupation = angular.copy($scope.xpItems[index]);
      $scope.editIndex = index;
      $scope.addWorkXpForm = true;

      fixFormDiv('#expFormDiv');
    };

    /**
     * [cancelJobXp will be trigger when cancel is clicked in form, will reset the form and clear the required variables]
     * @return {null} [description]
     */
    $scope.cancelJobXp = function(){
      $scope.occupation={};

      delete $scope.editIndex;

      $scope.stepTwo.$setUntouched();
      $scope.stepTwo.$setPristine();

      $scope.addWorkXpForm=false;
    }; //// fun. cancelJobXp

    /**
     * [showJobXp will be triggered when "Add Experinece" clicked to show the form and set the required vars]
     * @return {null} [description]
     */
    $scope.showJobXp = function(){
      $scope.occupation={};
      delete $scope.editIndex;
      $scope.addWorkXpForm=true;

      fixFormDiv('#expFormDiv');
    }; //// fun. ShowJobXp

      // var locations = [];
      // $scope.selectedLocation = undefined;

      // /**
      //  * [searchLocations used for the typeahead in company name, will get the matchin addrss based on entered query]
      //  * @param  {string} query [text string to search google places for]
      //  * @return {array}       [array of address objects from google places]
      //  */
      // $scope.searchLocations = function(query){
      //     if(!!query && query.trim() != ''){

      //         return geocodeService.placeSearch(query)
      //             .then(
      //                 function(data){
      //                     locations = [];
      //                     if(data.statusCode == 200){
      //                         data.results.predictions.forEach(function(prediction){
      //                             locations.push({address: prediction.description, placeId: prediction.place_id});
      //                         });
      //                         return locations;
      //                     } //// if statusCode == 200
      //                     else {
      //                         console.dir('error', data.statusCode);
      //                         return {};
      //                     }
      //                 },//// fun. reslove
      //                 function(error){
      //                     console.dir(error);
      //                 }/// fun. reject
      //             );//// then
      //     }//// if query
      // };/// fun. searchLocations

      // /**
      //  * [setAddress will set the right address component in scop when user select one address form typeahead]
      //  * @param {object} address [address object from selected item in typeahead]
      //  */
      // $scope.setAddress = function(address){
      //     $scope.occupation.formattedAddress = address.address;
      //     $scope.occupation.googlePlaceId = address.placeId;

      //     geocodeService.getPlaceDetails(address.placeId).then(function(data){
      //         var place = data.results.result;

      //         if(place){
      //             /**
      //              * Loop throught  address components and take what is needed
      //              */
      //             for (var i = 0; i < place.address_components.length; i++) {
      //                 var addressType = place.address_components[i].types[0];

      //                 switch (addressType){
      //                     // case "route":
      //                         // $scope.occupation.street1 = place.address_components[i][addressComponents[addressType]] || false;
      //                         // break;

      //                     // case "street_number":
      //                     //   $scope.user.number = place.address_components[i][addressComponents[addressType]] || false;
      //                     //   break;

      //                     // case "country":
      //                     //     $scope.occupation.country = place.address_components[i][addressComponents[addressType]] || false;
      //                     //     break;

      //                     case "administrative_area_level_1":
      //                         $scope.occupation.state = place.address_components[i].short_name || null;
      //                         break;

      //                     case "locality":
      //                         $scope.occupation.city = place.address_components[i].long_name || null;
      //                         break;

      //                     // case "postal_code":
      //                     //     $scope.occupation.postalCode = place.address_components[i][addressComponents[addressType]] || false;
      //                     //     break;
      //                 }//// switch
      //             }//// for

      //         }//// if place

      //     });

      // }//// fun. setAddress

    /**
     * [searchOccupations will be used in typeahead to query occs and return a list of matching]
     * @param  {string} query [string from typeahead text field]
     * @return {array}       [array of matched occupations]
     */
    $scope.occupationChoices = [];
    $scope.occupationState = "blankReportedOccTitle";
    $scope.searchOccupations = function(){
        return OccupationService.searchOccupations($scope.occupation.reportedOccTitle).then(function(matches){
          if (matches.length == 0) {
            $scope.occupationState = "notFound";
            console.log("Empty choices");
          } else {
            $scope.occupationState = "choicesAvailable";
            $scope.occupationChoices = matches.slice(0, 5);
            console.log("Showing choices");
          }
        });
    }; //// fun. searchOccupations

    $scope.chooseOccupation = function(occupationChoice, $event) {
      $scope.occupation.occTitle = occupationChoice.occTitle;
      $scope.occupation.occId = occupationChoice.occId;
      $scope.occupationChoices = [occupationChoice];
      $scope.occupationState = "chosen";
      console.log("Chosen");
      $event.preventDefault();
    };

    $scope.handleReportedOccTitleChange = function() {
      $scope.occupationState = "working";
      if($scope.occupation.reportedOccTitle == undefined || $scope.occupation.reportedOccTitle.trim().length == 0) {
        $timeout(function() {$scope.occupationState = "blankReportedOccTitle";}, 800);
        console.log("No rep title");
      } else if($scope.occupation.reportedOccTitle.trim().length < 4) {
        $timeout(function() {$scope.occupationState = "lowReportedOccTitle";}, 800);
        console.log("Low rep title");
      } else {
        $scope.occupation.occTitle = "";
        $scope.occupation.occId = "";
        $scope.occupationChoices = [];
        $scope.customDebounce($scope.searchOccupations, 1500);
      }
    };

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
            console.log("end date is less than start date");
            $scope.stepTwo.workDateEndY.$setValidity('invalidEndDate', end > start);
            $scope.stepTwo.workDateEndM.$setValidity('invalidEndDate', end > start);
          }

          /**
           * Check for date conflicts with previous dates
           */
          if(Array.isArray($scope.xpItems))
          for(var x=0; x<$scope.xpItems.length; x++){
            /**
             * Dont validate the range of the edit item with himself
             */
            if(!isNaN($scope.editIndex) && $scope.editIndex === x){
              console.log("range of the edit item with himself");
              continue;
            }
            /**
             * check if start date in a middle of range
             */
            if(start >= $scope.xpItems[x].dateStart && start < $scope.xpItems[x].dateEnd){
              console.log("start date in a middle of range");
              $scope.stepTwo.workDateStartY.$setValidity('startDateConflict', false);
              $scope.stepTwo.workDateStartM.$setValidity('startDateConflict', false);
              $scope.xpItems[x].conflict = true;
              break;
            }
            else{
              console.log("start date not in a middle of range");
              $scope.stepTwo.workDateStartY.$setValidity('startDateConflict', true);
              $scope.stepTwo.workDateStartM.$setValidity('startDateConflict', true);
              $scope.xpItems[x].conflict = false;
            }

            /**
             * check if end date in a middle of range
             */
            if(end > $scope.xpItems[x].dateStart && end <= $scope.xpItems[x].dateEnd){
              console.log("end date in a middle of range");
              $scope.stepTwo.workDateEndY.$setValidity('endDateConflict', false);
              $scope.stepTwo.workDateEndM.$setValidity('endDateConflict', false);
              $scope.xpItems[x].conflict = true;
              break;
            }
            else{
              console.log("end date not in a middle of range");
              $scope.stepTwo.workDateEndY.$setValidity('endDateConflict', true);
              $scope.stepTwo.workDateEndM.$setValidity('endDateConflict', true);
              $scope.xpItems[x].conflict = false;
            }

            /**
             * Check if new rang is overlap one old range
             */
            if(start <= $scope.xpItems[x].dateStart && end >= $scope.xpItems[x].dateEnd){
              console.log("new rang is overlap one old range");
              $scope.stepTwo.workDateEndY.$setValidity('endDateConflict', false);
              $scope.stepTwo.workDateEndM.$setValidity('endDateConflict', false);
              $scope.stepTwo.workDateStartY.$setValidity('startDateConflict', false);
              $scope.stepTwo.workDateStartM.$setValidity('startDateConflict', false);
              $scope.xpItems[x].conflict = true;
              break;
            }
            else{
              console.log("new rang is not overlap one old range");
              $scope.stepTwo.workDateEndY.$setValidity('endDateConflict', true);
              $scope.stepTwo.workDateEndM.$setValidity('endDateConflict', true);
              $scope.stepTwo.workDateStartY.$setValidity('startDateConflict', true);
              $scope.stepTwo.workDateStartM.$setValidity('startDateConflict', true);
              $scope.xpItems[x].conflict = false;
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
        /**
         * User is authenticated
         * do save
         */
        if(authService.isUserLoggedIn() && $scope.workExperienceChanged){
          var toSave = {
            workExperience:angular.copy($scope.xpItems)
          };
          userService.saveUser(toSave, authService.currentUserID)
          .then(
            function(user){
              console.log("User data updated");
              // Update user metrics now
              return user;
            },
            function(err){
              alert("Error!\nYour data was not saved, please try again.");
              console.log(err);
            }
          )
        }//// if isAuth
      });/// $on.$destroy

  }
})();