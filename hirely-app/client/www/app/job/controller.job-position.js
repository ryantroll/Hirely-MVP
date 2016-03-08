/**
 * Created by Iyad Bitar on 02/29/2016.
 */
(function () {
    'use strict';

  angular.module('hirelyApp.job').controller('JobPositionController', ['$scope', '$state', '$stateParams', '$timeout', 'AuthService', 'UserService', 'BusinessService', 'AvailabilityService', 'uiGmapGoogleMapApi', 'uiGmapIsReady', JobPositionController]);

  function JobPositionController($scope, $state, $stateParams, $timeout, AuthService, UserService, BusinessService, AvailabilityService, uiGmapGoogleMapApi, uiGmapIsReady) {

    BusinessService.getBySlug($stateParams.businessSlug)
    .then(
      function(business){

        $scope.business = business;
        $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);

        $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business)

        /**
         * Check if user is logged in and move to next promise
         */
        return AuthService.getAuth();
      },
      function(err){
        console.log(err);
        // $scope.dataLoaded = true;
        $scope.dataError = true;
      }
    )
    .then(
      function(isAuth){
        /**
         * user is logged in
         */
        $scope.isAuth = isAuth;

      },
      function(err){
        /**
         * User in not logged in
         */
        $scope.isAuth = false;
        console.log(AuthService.currentUserID)
      }
    )
    .finally(
      function(){
        initialize();
      }
    );



    var sideBar = angular.element('#sideBar');
    var stickyHeader = angular.element('#stickyHeader');
    var posDetails = angular.element('#posDetails');

    function posWindowScroll(e){
      var diff = posDetails.offset().top - $(e.target).scrollTop();

      if(  diff <= 0 ){
        if( !stickyHeader.hasClass('show') ){
          stickyHeader.addClass('show');
        }

        /**
         * Don't make the sidebar sticky if it increase the height more than the the details height
         * -28 because the last box in details has margin bottom and this make sidebar stop at right position
         */
        if(
          sideBar.height()+Math.abs(diff) <= posDetails.height() - 28
          && angular.element('#wageBox').css('display') !== 'none'
        ){
          sideBar.css('padding-top', Math.abs(diff) + 'px');
        }

      }
      else{
        if( stickyHeader.hasClass('show') ){
          stickyHeader.removeClass('show');
          sideBar.css('padding-top', '');
        }
      }

    }//// fun. posWindowScroll

    function initialize(){


      $scope.numOfBenefits = getNumOfBenefits();
      $scope.workTypeTitle = BusinessService.getWorkTypeTitle($scope.position.workType);

      $scope.aggregatedWeekTimes = AvailabilityService.getWeeklyAggregatedArray($scope.location.hoursOfOperation);

      $scope.otherPositions = [];
      for(var pos in $scope.business.positions){
        //// add position in same location only
        if($scope.business.positions[pos].location_id === $scope.location._id ){
          $scope.otherPositions.push($scope.business.positions[pos]);
        }
      }
      console.log($scope.otherPositions)
      $timeout(function() {
        $scope.dataLoaded = true;
      }, 200);


      /**
       * if user logged in get the distance
       */
      if($scope.isAuth){
        /**
         * get the distance between user and location
         */
        // uiGmapGoogleMapApi.then(function(maps){
        //   var directionsService = new maps.DirectionsService();
        //   var request = {
        //     origin: new maps.LatLng(
        //       from.lat(),
        //       from.lng()
        //     ),
        //     destination: new maps.LatLng(
        //       to.lat(),
        //       to.lng()
        //     ),
        //     travelMode: maps.TravelMode['DRIVING'],
        //     optimizeWaypoints: true
        //   };
        // });//// uiGmapGoogleMapApi.them
      }//// if isAuth

      angular.element(window).on('scroll', posWindowScroll)
    }//// fun. initialize

    var getNumOfBenefits = function(){
      var numOfBenefits = 0;
      for(var ben in $scope.position.benefits){

        if(true === $scope.position.benefits[ben]) ++numOfBenefits;
      }
      return numOfBenefits;
    }//// fun. numOfBenefits

    $scope.applyClick = function(){
      $state.go('application.apply', {businessSlug:$scope.business.slug, locationSlug:$scope.location.slug, positionSlug:$scope.position.slug});
    }


    $scope.getWorkTypeTitle = function(type){
      return BusinessService.getWorkTypeTitle(type);
    }

  }//// fun. JobController

 })();
