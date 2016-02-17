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
  step5App.controller('ProfileAvailabilityController', ['$scope', '$stateParams', '$filter', '$timeout', 'multiStepFormInstance', 'GeocodeService', '$q', 'AvailabilityService', 'AuthService', ProfileAvailabilityController])

  function ProfileAvailabilityController($scope, $stateParams, $filter, $timeout, multiStepFormInstance, GeocodeService, $q, AvailabilityService, AuthService) {

    /**
     * [availability this object will hold the data that need bot saved in database
     * this object will be inhereted from parent scope which is MulitFormDataScope
     * there is if() statement before initializing $scope variable to make sure the are never overwritten
     * when use navigate between stpes]
     * @type {Object}
     */
    // if(angular.isUndefined($scope.availability)) $scope.availability = {};


    $scope.stepFiveLoaded = false;

    $scope.startOptions = AvailabilityService.startOptions;

    $scope.days = AvailabilityService.days;

    $scope.hours = AvailabilityService.hours;

    /**
     * [dayHours will hold the numbe of hours in each day]
     * @type {Object}
     */
    $scope.dayHours = {};

    /**
     * [totalHours will hold the total number of hours in a week and will be calculated on timetable save and initial]
     * @type {Number}
     */
    $scope.totalHours = 0;


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

            //// set the number of hours in each day
            $scope.totalHours = 0;
            for(var d=0; d<7; d++){
              var dayHours = AvailabilityService.getDayHours($scope.availability.weeklyTimetable[$scope.days[d]]);
              $scope.dayHours[$scope.days[d]] = dayHours;
              $scope.totalHours += dayHours;
            }

          },/// resolve
          function(){
            //// availability not in DB create empty one of user
            var weeklyTimetable = {};
            for(var d=0; d<7; d++){
              weeklyTimetable[$scope.days[d]] = [];
              for(var h=0; h<24; h++){
                var _h = angular.extend({}, $scope.hours[h]);
                _h.active = false;
                weeklyTimetable[$scope.days[d]].push(_h);
              }//// for h
            }//// for d
            $scope.availability.weeklyTimetable = weeklyTimetable;

            //// build empty dayHours
            for(var d=0; d<7; d++){
              $scope.dayHours[$scope.days[d]] = 0;
            }

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
         * Need to wait untill all views and data is been loaded to update the validity of form
         * because the multi step form doesn't provide any way to detect the step loading we have to use $q.all
         */
        $q.all()
          .then(function() {
            //At this point all data is available for angular to render


            /**
             * [stepFiveLoaded set to true to remove loader and show form]
             * @type {Boolean}
             */

            $timeout(function(){
              if(!$scope.stepOneLoaded){
                $scope.updateValidity();
                $scope.stepFiveLoaded = true;
              }
            }, 1000);
          });

      } //// fun. initializeScope


      /**
       * [hourClick trigger on td click event to set/unset hour availablity in time table]
       * @param  {[string]} day  [name of day in short format]
       * @param  {[number]} hour [hour of day to be set 0 -> 23]
       * @return {[type]}      [description]
       */
      $scope.hourClick = function(hour){

        if(angular.isUndefined($scope.currentDays)) return null;

        $scope.currentDays[$scope.currentDayLabel][hour].active = !$scope.currentDays[$scope.currentDayLabel][hour].active

      }//// fun. hourClick

      $scope.updateValidity = function(){
        //// set validity for max and min hours
        // $scope.stepFive.maxHours.$setValidity( 'mismatch', $scope.totalHours.total <= $scope.availability.hoursPerWeekMax);
        // console.log($scope.totalHours.total, $scope.availability.hoursPerWeekMin)
        $scope.stepFive.minHours.$setValidity( 'mismatch', $scope.totalHours >= parseInt($scope.availability.hoursPerWeekMin, 10) );
        $scope.stepFive.maxHours.$setValidity( 'mismatch', parseInt($scope.availability.hoursPerWeekMin,10) <= parseInt($scope.availability.hoursPerWeekMax,10));
      }

      /**
     * [fixFormDiv will set the form div to window height and scroll page to top
     * form is shown as an overlay and should cover the whole screen]
     * @return {null}
     */
    function fixFormDiv(){
      var formDiv = $('#expFormDiv');
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

      $scope.showTimeTable = function(day, index){

        /**
         * Don't create new copy of currentDays if exists
         * this function can be called from inside days buttons in this case the other days data will be erased if copy is exectured
         * Only save and cancel will delete currentDays
         */
        if(angular.isUndefined($scope.currentDays)){
          $scope.currentDays = angular.copy($scope.availability.weeklyTimetable);
        }
        $scope.currentDayLabel = day;
        $scope.currentDayIndex = index;

        $scope.addTimetable = true;

        fixFormDiv();
      }//// showTimetable;

      $scope.cancelTimetable = function(){
        delete $scope.currentDays;
        delete $scope.currentDayLabel;
        delete $scope.currentDayIndex;

        $scope.addTimetable = false;
      }/// fun. cancelTimetable

      $scope.saveTimetable = function(){
        if(angular.isUndefined($scope.currentDays) || angular.isUndefined($scope.currentDayLabel)){
          return null;
        }

        $scope.availability.weeklyTimetable = angular.copy($scope.currentDays);

        /**
         * Update the number of hours for each day
         */
         $scope.totalHours = 0;
          for(var d=0; d<7; d++){
            var dayHours = AvailabilityService.getDayHours($scope.availability.weeklyTimetable[$scope.days[d]]);
            $scope.dayHours[$scope.days[d]] = dayHours;
            $scope.totalHours += dayHours;
          }

          $scope.updateValidity();

        delete $scope.currentDays;
        delete $scope.currentDayLabel;
        delete $scope.currentDayIndex;

        $scope.addTimetable = false;
      }//// fun. saveTimetable

      $scope.nextDay = function(){
        if(angular.isUndefined($scope.currentDays) || angular.isUndefined($scope.currentDayLabel) || angular.isUndefined($scope.currentDayIndex)){
          return null;
        }
        $scope.currentDayIndex = ($scope.currentDayIndex + 1) % 7;
        $scope.currentDayLabel = $scope.days[$scope.currentDayIndex];

      }//// fun. nextDay

      $scope.previousDay = function(){
        if(angular.isUndefined($scope.currentDays) || angular.isUndefined($scope.currentDayLabel) || angular.isUndefined($scope.currentDayIndex)){
          return null;
        }
        var pre = ($scope.currentDayIndex - 1) % 7;
        $scope.currentDayIndex = pre < 0 ? 6 : pre;
        $scope.currentDayLabel = $scope.days[$scope.currentDayIndex];

      }//// fun. nextDay

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