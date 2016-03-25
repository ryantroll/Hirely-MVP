/**
 *
 * Applicant List Main Controller
 *
 * Iyad Bitar
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('CandidateDetailsController', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', '$interpolate', '$uibModalInstance', 'DEFAULT_PROFILE_IMAGE', 'AvailabilityService', 'BusinessService', 'JobApplicationService', CandidateDetailsController]);


  function CandidateDetailsController($scope, $rootScope, $stateParams, $state, $timeout, $interpolate, $uibModalInstance, DEFAULT_PROFILE_IMAGE, AvailabilityService, BusinessService, JobApplicationService) {
    $scope.defaultImage = DEFAULT_PROFILE_IMAGE;

    $scope.days = AvailabilityService.days;

    $scope.hours = AvailabilityService.hours;

    $scope.availability = AvailabilityService.toFrontEndModel($scope.applicants[$scope.detailsUserId].availability);

    $scope.statusLabels = JobApplicationService.statusLabels;

    /**
     * get experience icons
     */
    var strOccIds = [];
    for(var x=0; x<$scope.applicants[$scope.detailsUserId].workExperience.length; x++){
      strOccIds.push($scope.applicants[$scope.detailsUserId].workExperience[x].occId);
    }
    /**
     * Get the icons and colors data for all occupations needed for this page
     */
    BusinessService.getPositionDisplayData(strOccIds.join('|'))
    .then(
      function(iconData){
        $scope.iconData = iconData;
      },
      function(error){
        console.log(error)
      }
    );

    $scope.getAvailabilityByDays = function(){
      var days = Number($scope.applicants[$scope.detailsUserId].availability.startAvailability)
      var list = AvailabilityService.startOptions;
      var ret = '';

      for(var x=0; x<list.length; x++){
        if(list[x].days === days){
          ret = list[x].label;
          break;
        }
      }
      return ret;
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

      }//// showTimetable;

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

      $scope.getDateDif = function(index){
        var start = new Date($scope.applicants[$scope.detailsUserId].workExperience[index].dateStart);
        var end = $scope.applicants[$scope.detailsUserId].workExperience[index].dateEnd ? new Date($scope.applicants[$scope.detailsUserId].workExperience[index].dateEnd) : new Date();
        var dif = end - start;
        dif = dif / 1000;
        var secInYear = 525600 * 60;
        var secInMonth = 43800 * 60;
        var years = Math.floor(dif / secInYear);
        var months = Math.round( (dif - years *secInYear) / secInMonth );
        var ret = '(';
        if(years > 0){
          ret += years.toString() + ' year' + (years > 1 ? 's' : '');
        }
        if(months > 0){
          ret += ' ' + months.toString() + ' month' + (months > 1 ? 's' : '');
        }
        ret += ')';
        return ret;
      }

      $scope.getPositionIcon = function(occId, property){

        if(!occId || !Array.isArray($scope.iconData)){
          return null;
        }
        var icon;
        for(var x=0; x<$scope.iconData.length; x++){
            if($scope.iconData[x].occId == occId){
              icon = $scope.iconData[x];
              break;
            }
        }/// for

        if(angular.isDefined(icon) && angular.isDefined(icon[property])){
          return icon[property];
        }
        return null;
      }//// fun. getIcon

      $scope.closeModal = function(){
        $uibModalInstance.close();
      }

      $scope.nextApplication = function(){
        var newIndex = $scope.detailsIndex + 1;

        if(newIndex < $scope.applications.length){
          $scope.detailsIndex = newIndex;
          $scope.detailsApp = $scope.applications[newIndex];
          $scope.detailsUserId = $scope.detailsApp.userId;
        }
      }//// fun. nextApplication

      $scope.preApplication = function(){
        var newIndex = $scope.detailsIndex -1;

        if(newIndex > 0){
          $scope.detailsIndex = newIndex;
          $scope.detailsApp = $scope.applications[newIndex];
          $scope.detailsUserId = $scope.detailsApp.userId;
        }
      }//// fun. previousApplication

      /**
       * initiate the availability table to monday
       */
      $scope.showTimeTable('mon', 0);

      console.log($scope.applicants[$scope.detailsUserId].education)
  }//// controller
})();
