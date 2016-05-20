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

    var step5App = angular.module('hirelyApp');


    /**
     * ******************************************************************************
     * Controller Definition ********************************************************
     * ******************************************************************************
     */
    step5App.controller('ProfileAvailabilityController', ['$scope', '$timeout', 'AuthService', 'AvailabilityService', ProfileAvailabilityController])

    function ProfileAvailabilityController($scope, $timeout, AuthService, availabilityService) {

        /**
         * [availability this object will hold the data that need bot saved in database
         * this object will be inhereted from parent scope which is MulitFormDataScope
         * there is if() statement before initializing $scope variable to make sure the are never overwritten
         * when use navigate between stpes]
         * @type {Object}
         */
        // if(angular.isUndefined($scope.availability)) $scope.availability = {};


        $scope.stepFiveLoaded = false;

        $scope.startOptions = availabilityService.startOptions;
        $scope.seasonOptions = availabilityService.seasonOptions;

        $scope.days = availabilityService.days;

        $scope.hours = availabilityService.hours;

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


        $scope.initAvail = function () {
            /**
             * [weeklyTimetable build the weekly timetable for availability and assign it to scope
             * this operation might take some time if new availability need to be created
             * because of online database letancy so the process is sequenced in promises
             * The finally scopeInitialize function is called to set the right variables]
             * @type {Array}
             */

            $scope.availability = availabilityService.toFrontEndModel(AuthService.currentUser.availability);

            /**
             * Set total hours after loading data
             */
            updateTotalHours();

            $scope.isSeasonal = $scope.availability.season != null;

            $scope.updateValidity();
            $(window).scrollTop(0);
            $scope.stepFiveLoaded = true;

        }; //// fun. initAvail
        $timeout($scope.initAvail);


        /**
         * [hourClick trigger on td click event to set/unset hour availablity in time table]
         * @param  {[string]} day  [name of day in short format]
         * @param  {[number]} hour [hour of day to be set 0 -> 23]
         * @return {[type]}      [description]
         */
        $scope.hourClick = function (hour) {

            if (angular.isUndefined($scope.currentDays)) return null;

            $scope.currentDays[$scope.currentDayLabel][hour].active = !$scope.currentDays[$scope.currentDayLabel][hour].active

        }//// fun. hourClick

        $scope.updateValidity = function () {
            //// set validity for max and min hours
            $scope.stepFive.minHours.$setValidity( 'mismatch', $scope.totalHours <= $scope.availability.hoursPerWeekMax);

            // The following is not working
            $scope.stepFive.minHours.$setValidity('mismatch', $scope.totalHours >= parseInt($scope.availability.hoursPerWeekMin, 10));
            $scope.stepFive.maxHours.$setValidity('mismatch', parseInt($scope.availability.hoursPerWeekMin, 10) <= parseInt($scope.availability.hoursPerWeekMax, 10));
        }

        /**
         * [fixFormDiv will set the form div to window height and scroll page to top
         * form is shown as an overlay and should cover the whole screen]
         * @return {null}
         */
        function fixFormDiv() {
            var formDiv = $('#availFormDiv');
            $(window).scrollTop(0);
            /**
             * Add some delay so we can read the height property after div is added to dom
             */
            setTimeout(function () {
                if (formDiv.height() < $(document).height()) {
                    formDiv.height($(document).height());
                }
            }, 100)
        }

        $scope.showTimeTable = function (day, index) {

            /**
             * Don't create new copy of currentDays if exists
             * this function can be called from inside days buttons in this case the other days data will be erased if copy is exectured
             * Only save and cancel will delete currentDays
             */
            if (angular.isUndefined($scope.currentDays)) {
                $scope.currentDays = angular.copy($scope.availability.weeklyTimetable);
            }
            $scope.currentDayLabel = day;
            $scope.currentDayIndex = index;

            $scope.addTimetable = true;

            fixFormDiv();
        }//// showTimetable;

        $scope.cancelTimetable = function () {
            delete $scope.currentDays;
            delete $scope.currentDayLabel;
            delete $scope.currentDayIndex;

            $scope.addTimetable = false;
        }/// fun. cancelTimetable

        function updateTotalHours(){
            $scope.totalHours = 0;
            for (var d = 0; d < 7; d++) {
                var dayHours = availabilityService.getDayHours($scope.availability.weeklyTimetable[$scope.days[d]]);
                $scope.dayHours[$scope.days[d]] = dayHours;
                $scope.totalHours += dayHours;
            }
            console.log($scope.totalHours, '<<')
        }

        $scope.saveTimetable = function () {
            if (angular.isUndefined($scope.currentDays) || angular.isUndefined($scope.currentDayLabel)) {
                return null;
            }

            $scope.availability.weeklyTimetable = angular.copy($scope.currentDays);

            /**
             * Update the number of hours for each day
             */
             updateTotalHours();

            $scope.updateValidity();

            delete $scope.currentDays;
            delete $scope.currentDayLabel;
            delete $scope.currentDayIndex;

            $scope.addTimetable = false;
        }//// fun. saveTimetable

        $scope.nextDay = function () {
            if (angular.isUndefined($scope.currentDays) || angular.isUndefined($scope.currentDayLabel) || angular.isUndefined($scope.currentDayIndex)) {
                return null;
            }
            $scope.currentDayIndex = ($scope.currentDayIndex + 1) % 7;
            $scope.currentDayLabel = $scope.days[$scope.currentDayIndex];

        }//// fun. nextDay

        $scope.previousDay = function () {
            if (angular.isUndefined($scope.currentDays) || angular.isUndefined($scope.currentDayLabel) || angular.isUndefined($scope.currentDayIndex)) {
                return null;
            }
            var pre = ($scope.currentDayIndex - 1) % 7;
            $scope.currentDayIndex = pre < 0 ? 6 : pre;
            $scope.currentDayLabel = $scope.days[$scope.currentDayIndex];

        }//// fun. nextDay

        /**
         * The way Multi step form work that you have to sabe the data in $scope destory event
         */
        $scope.$on('$destroy', function () {
            console.log("Caught avail destroy");

            availabilityService.save(angular.copy($scope.availability), AuthService.currentUserId)
                .then(
                    function (user) {
                        console.log("Avail is saved");
                        angular.extend(AuthService.currentUser, {availability: user.availability});
                    },//// .save resolve
                    function (error) {
                        /**
                         * Error in saving
                         */
                        alert('Availability Save Error!\n' + error);
                    }//// save reject
                );//// save then

        });// $on.$destory
    }////fun. stepFiveController
})();