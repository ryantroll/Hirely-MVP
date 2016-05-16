/**
 * Created by Iyad Bitar on 02/29/2016.
 */
(function () {
    'use strict';

  angular.module('hirelyApp.job').controller('JobBusinessController', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$sce', 'BusinessService', 'AvailabilityService', 'FavoritesService', 'AuthService', JobBusinessController]);

  function JobBusinessController($scope, $rootScope, $state, $stateParams, $timeout, $sce, BusinessService, AuthService) {
    console.log($stateParams.businessSlug);

    BusinessService.getBySlug($stateParams.businessSlug)
    .then(
      function(business){

        $scope.business = business;

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

        // $timeout(function() {
        //   var heroHeight = $('.hero').height();
        //   var heroImgHeight = $('.hero img').height();
        //   if (heroImgHeight - heroHeight) {
        //     $('.hero img').css('margin-top', -(heroImgHeight - heroHeight)/2)
        //   }
        // })

      }, 200);

    }//// fun. initialize



  }//// fun. JobController

 })();
