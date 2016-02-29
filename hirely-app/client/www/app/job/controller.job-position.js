/**
 * Created by Iyad Bitar on 02/29/2016.
 */
(function () {
    'use strict';

  angular.module('hirelyApp.job').controller('JobPositionController', ['$scope', '$state', '$stateParams', 'BusinessService', JobPositionController]);

  function JobPositionController($scope, $state, $stateParams, BusinessService) {

    BusinessService.getBySlug($stateParams.businessSlug)
    .then(
      function(business){

        $scope.business = business;
        $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);

        $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business)

        console.log($scope.business, $scope.location, $scope.position)

        /**
         * Check if user is logged in and move to next promise
         */
        // return AuthService.getAuth();
      },
      function(err){
        console.log(err)
      }
    )
  }//// fun. JobController

 })();
