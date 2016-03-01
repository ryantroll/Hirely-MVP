/**
 * Created by Iyad Bitar on 02/29/2016.
 */
(function () {
    'use strict';

  angular.module('hirelyApp.job').controller('JobPositionController', ['$scope', '$state', '$stateParams', '$timeout', 'BusinessService', JobPositionController]);

  function JobPositionController($scope, $state, $stateParams, $timeout, BusinessService) {

    BusinessService.getBySlug($stateParams.businessSlug)
    .then(
      function(business){

        $scope.business = business;
        $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);

        $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business)


        initialize();
        /**
         * Check if user is logged in and move to next promise
         */
        // return AuthService.getAuth();
      },
      function(err){
        console.log(err)
      }
    )

    function initialize(){

      $timeout(function() {
        $scope.dataLoaded = true;
        $scope.dataError = false;
      }, 200);

    }
  }//// fun. JobController

 })();
