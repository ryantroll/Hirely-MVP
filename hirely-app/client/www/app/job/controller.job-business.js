/**
 * Created by Iyad Bitar on 02/29/2016.
 */
(function () {
    'use strict';

  angular.module('hirelyApp.job').controller('JobBusinessController', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$sce', 'BusinessService', 'AuthService', 'AvailabilityService', JobBusinessController]);

  function JobBusinessController($scope, $rootScope, $state, $stateParams, $timeout, $sce, BusinessService, AuthService, AvailabilityService) {
    console.log($stateParams.businessSlug);

    BusinessService.getBySlug($stateParams.businessSlug)
    .then(
      function(business){

        $scope.business = business;

        var businessByStates = BusinessService.arrangeLocationsByStates( business );

        console.log(businessByStates)
        ///// build an aggregated weekly times
        for(var s=0; s<businessByStates.length; s++){
          for(var l=0; l<businessByStates[s].locations.length; l++){
            var times = AvailabilityService.getWeeklyAggregatedArray($scope.business.locations[ businessByStates[s].locations[l].id ].hoursOfOperation, true);
            $scope.business.locations[ businessByStates[s].locations[l].id ].aggregatedWeekTimes = times;
          }///// for l
        }//// for s
        $scope.businessByStates = businessByStates;

        initialize();
      }
    );





    function initialize(){

      /**
       * Check for data error first of all
       */
      $scope.dataError = !$scope.business;

      /**
       * don't continue if there is a data error
       */
      if($scope.dataError){
        $scope.dataLoaded = true;
        return;
      }

      $scope.heroImageURL = $scope.location.heroImageURL ? $scope.location.heroImageURL : $scope.business.heroImageURL;
      $scope.businessDescriptionHtml = $sce.trustAsHtml($scope.business.description);
      // $scope.positionDescriptionHtml = $sce.trustAsHtml($scope.position.description);





      /**
       * Wait for some time and before showing the page
       */
      $timeout(function() {
        $scope.dataLoaded = true;

      }, 200);

    }//// fun. initialize

    $scope.expandState = function(state){

      if($scope.stateToShow !== state){
        $scope.stateToShow = state;
      }
      else{
        $scope.stateToShow = null;
      }

    }

  }//// fun. JobController

 })();
