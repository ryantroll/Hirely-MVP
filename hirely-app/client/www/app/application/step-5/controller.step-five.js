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

  var step5App =  angular.module('hirelyApp');



  /**
   * ******************************************************************************
   * Controller Definition ********************************************************
   * ******************************************************************************
   */
  step5App.controller('StepFiveController', ['$scope', '$stateParams', '$window', 'multiStepFormInstance', 'GeocodeService', '$q', 'AvailabilityService', 'AuthService', StepFiveController])

  function StepFiveController($scope, $stateParams, $window, multiStepFormInstance, GeocodeService, $q, AvailabilityService, AuthService) {

    /**
     * [availability this object will hold the data that need bot saved in database
     * this object will be inhereted from parent scope which is MulitFormDataScope
     * there is if() statement before initializing $scope variable to make sure the are never overwritten
     * when use navigate between stpes]
     * @type {Object}
     */
    // if(angular.isUndefined($scope.availability)) $scope.availability = {};


    $scope.stepFiveLoaded = false;

      /**
       * [weeklyTimetable build the weekly timetable for availability and assign it to scope
       * this operation might take some time if new availability need to be created
       * because of online database letancy so the process is sequenced in promises
       * The finally scopeInitialize function is called to set the right variables]
       * @type {Array}
       */

      if(angular.isUndefined($scope.availability.weeklyTimetable)){

        //// availability table dose not exits in scope
        //// check if availability for this user exists in DB
        AvailabilityService.isAvailabilityExists(AuthService.currentUserID)
        .then(
          function(retObj){
            //// the availability exists in DB
            $scope.availability = retObj;
          },/// resolve
          function(){
            //// availability not in DB create empty one of user
            var weeklyTimetable = [];
            for(var h=0; h<24; h++){
              var days = {};
              for(var day in AvailabilityService.days){
                days[AvailabilityService.days[day]] = false;
              }/// for in
              weeklyTimetable[h] = {
                'label': AvailabilityService.hours[h].label,
                'days': days
              };
            }//// for

            $scope.availability.weeklyTimetable = weeklyTimetable;

          }//// reject
        )//// then isAvailabilityExists
        .finally(
          function(){
            initializeScope();
          }/// fun. in finally
        );//// finally
      }/// if weeklyTimetable
      else{
        //// initalize scope immediatly if weeklyTimetable exists

        initializeScope();
      }


      /**
       * [initializeScope this function will called afer the availabiliyt.weeklyTimetable is been set by above code]
       * @return {[type]} [description]
       */
      function initializeScope(){

        /**
         * [initialize the maxHour and minHours variables ]
         * @type {Number}
         */
        if(angular.isUndefined($scope.availability.hoursPerWeekMax)) $scope.availability.hoursPerWeekMax = 1;
        if(angular.isUndefined($scope.availability.hoursPerWeekMin)) $scope.availability.hoursPerWeekMin = 1;
        if(angular.isUndefined($scope.availability.seekerStatus)) $scope.availability.seekerStatus = true;
        if(angular.isUndefined($scope.availability.startAvailability)) $scope.availability.startAvailability = 0;

        /**
         * [weeklyRanges scope variable to hold the the range data for mobile layout only
         * the a temp variable is used to get the ranges from AvailabilityServices]
         * @type {Object}
         */

        var ranges = {};
        ranges = AvailabilityService.updateRanges($scope.availability.weeklyTimetable);
        $scope.weeklyRanges = ranges;


        /**
         * [totalHours hold the total number of hours in each week and each day
         * with .total property for total in week, .sa property total in sunday, ..
         * used for validation and display purpos only]
         * @type {[object]}
         */
        $scope.totalHours = AvailabilityService.getTotalHours($scope.availability.weeklyTimetable);

        /**
         * Need to wait untill all views and data is been loaded to update the validity of form
         * because the multi step form doesn't provide any way to detect the step loading we have to use $q.all
         */
        $q.all()
          .then(function() {
            //At this point all data is available for angular to render
            $scope.updateValidity();

            /**
             * [stepFiveLoaded set to true to remove loader and show form]
             * @type {Boolean}
             */

            $scope.stepFiveLoaded = true;
          });

      } //// fun. initializeScope


      /**
       * [hourClick trigger on td click event to set/unset hour availablity in time table]
       * @param  {[string]} day  [name of day in short format]
       * @param  {[number]} hour [hour of day to be set 0 -> 23]
       * @return {[type]}      [description]
       */
      $scope.hourClick = function(day, hour){

        $scope.availability.weeklyTimetable[hour].days[day] = !$scope.availability.weeklyTimetable[hour].days[day];

        //// update totalHours
        $scope.totalHours = AvailabilityService.getTotalHours($scope.availability.weeklyTimetable);

        $scope.updateValidity();
      }//// fun. hourClick

      $scope.updateValidity = function(){
        //// set validity for max and min hours
        // $scope.stepFive.maxHours.$setValidity( 'mismatch', $scope.totalHours.total <= $scope.availability.hoursPerWeekMax);
        // console.log($scope.totalHours.total, $scope.availability.hoursPerWeekMin)
        $scope.stepFive.minHours.$setValidity( 'mismatch', $scope.totalHours.total >= $scope.availability.hoursPerWeekMin);
        $scope.stepFive.maxHours.$setValidity( 'mismatch', $scope.availability.hoursPerWeekMin <= $scope.availability.hoursPerWeekMax);
      }


      /**
       * [isMobile will be set on window.resize event]
       * @type {Boolean}
       */
      $scope.isMobile = false;

      /**
       * [onResize window.resize event to detect screen width
       * and trigger availablility ranges excraction from timetable when on mobile
       * availablity ranges need only on mobile so we update them only when on mobile]
       * @return {[type]} [description]
       */
      $scope.onResize = function(){
        // $scope.isMobile = $window.innerWidth <= 768;
        if($window.innerWidth <= 768 && !$scope.isMobile){
          $scope.isMobile = true;
          var ranges = {};
          ranges = AvailabilityService.updateRanges($scope.availability.weeklyTimetable);
          $scope.weeklyRanges = ranges;
        }
        else{
          $scope.isMobile = false;
        }
      }//// fun. onResize

      /**
       * [window resize event binding, it calls scope function only]
       *
       */
      angular.element($window).bind('resize', function(){
        $scope.onResize();
      });

      /**
       * [removeRange trigger on click event of 'delete' button next to each time availablity range on mobile]
       * @param  {[string]} hashKey [angular hashke value to ]
       * @param  {[string]} day     [name of day in short format]
       * @param  {[number]} start   [hour to start from]
       * @param  {[number]} count   [hour to end on]
       * @return {[type]}         [description]
       */
      $scope.removeRange = function(hashKey, day, start, count){

        //// remove from timetable
        for(var i=start; i<start+count && i < 24; i++){
          $scope.availability.weeklyTimetable[i].days[day] = false;
        }

        ///// remove from ranges
        ///// No need to rebuild ranges array
        ///// we can remove the range directly for quicker update
        angular.forEach($scope.weeklyRanges[day], function(obj, index){
          if(obj.$$hashKey === hashKey){
            $scope.weeklyRanges[day].splice(index, 1);
          }
        });

        //// update totalHours
        $scope.totalHours = AvailabilityService.getTotalHours($scope.availability.weeklyTimetable);

        //// update the validity
        $scope.updateValidity();
      }/// fun. removeRange


      /**
       * [formRanges  will hold the selected values when user input availability on mobile
       * this variable and its value only for form input and shouldn't be saved in DB]
       * @type {Object}
       */
      $scope.formRanges = {};
      for(var d = 0; d<7; d++){
        $scope.formRanges[ AvailabilityService.days[d] ] = {'min': undefined, 'max': undefined};
      }

      /**
       * [hoursList to show list of hours in 'From' drop down in mobile version
       * Slice is used to brack the object reference and get fresh one]
       * @type {[type]}
       */
      $scope.hoursListMin =  AvailabilityService.hours.slice(0);

      /**
       * [hoursListMax to show list of hours in 'From' drop down in mobile version
       * Slice is used to brack the object reference and get fresh one
       * the first item in array which is 12AM is rotated to the end of array
       * to allow user to end his range on 12AM]
       * @type {[type]}
       */
      $scope.hoursListMax =  AvailabilityService.hours.slice(0);
      $scope.hoursListMax.push($scope.hoursListMax.shift());

      /**
       * [rangeMinChange triggered on change event of 'from' drop-down to prevent user from selecting wrong range boundray]
       * @param  {[string]} day [name of day in short format]
       * @return {[none]}     [description]
       */
      $scope.rangeMinChange = function(day){
        if(!angular.isUndefined($scope.formRanges[day].max)){
          var start = parseInt( $scope.formRanges[day].min,10);
          var end = parseInt($scope.formRanges[day].max,10);

          if(start >= end && end !== 0) $scope.formRanges[day].max = undefined;
        }
      }

      /**
       * [rangeMaxChange triggered on change event of 'to' drop-down to prevent user from selecting wrong range boundray]
       * @param  {[string]} day [name of day in short format]
       * @return {[type]}     [description]
       */
      $scope.rangeMaxChange = function(day){
        if(!angular.isUndefined($scope.formRanges[day].min)){
          var start = parseInt( $scope.formRanges[day].min,10);
          var end = parseInt($scope.formRanges[day].max,10);
          if(start >= end && end !== 0) $scope.formRanges[day].min = undefined;
        }
      }

      /**
       * [addRange triggered on click event of 'add' button to add new availability range on mobile]
       * @param {[string]} day [name of day in short format]
       */
      $scope.addRange = function(day){
        if(!angular.isUndefined($scope.formRanges[day].min)
          && !angular.isUndefined($scope.formRanges[day].max)
        ){
          var start = parseInt($scope.formRanges[day].min, 10);
          var end = parseInt($scope.formRanges[day].max, 10);

          //// adjust end of range when user select 12AM in range max
          if(end === 0){
            end = 24;
          }

          if(start < end){
            //// Add to timetable
            for(var i=start; i<end && i < 24; i++){
              $scope.availability.weeklyTimetable[i].days[day] = true;
            }

            $scope.formRanges[day].min = undefined;
            $scope.formRanges[day].max = undefined;

            var ranges = {};
            ranges = AvailabilityService.updateRanges($scope.availability.weeklyTimetable);
            $scope.weeklyRanges = ranges;
          }/// if start < end
        }/// if !isUndefined
      }//// fun. addRange



        /**
         * The way Multi step form work that you have to sabe the data in $scope destory event
         */
        $scope.$on('$destroy', function(){


          /**
           * Save to DB After checking authentication
           */
          AuthService.getAuth().then(
            function(isAuth){
              if(true === isAuth){
                /**
                 * user is logged in do availability saving
                 */
                AvailabilityService.save( angular.copy($scope.availability), AuthService.currentUserID)
                  .then(
                    function(isSave){
                      /**
                       * Availability saved successfully
                       */

                      // var jobApp = new JobApplication($scope.availability.startDate, $scope.availability.hoursPerWeekMin, $scope.availability.hoursPerWeekMax);
                      // JobApplicationService.save(jobApp, AuthService.currentUserID, $scope.jobID)
                    },//// .save resolve
                    function(error){
                      /**
                       * Error in saving
                       */
                      alert('Availability Save Error!\n' + error);
                    }//// save reject
                  );//// save then
              }/// if auth
            }, //getAuth resolve
            function(error){
              /**
               * Error in authentication
               */
              // alert("Authentication Error!\n" + error);
            }/// getAuth reject
          ); // getAuth then

        });// $on.$destory
  }////fun. stepFiveController
})();