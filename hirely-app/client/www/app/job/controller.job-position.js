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

      var sideBar = angular.element('#sideBar');
      var stickyHeader = angular.element('#stickyHeader');
      var posDetails = angular.element('#posDetails');

      var posWindowScroll = function(e){
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


        // sideBar.css('top', diff+'px');
        // console.log(angular.element('#wageBox').css('display') );
      }//// fun. posWindowScroll

      angular.element(window).on('scroll', posWindowScroll)
    }//// fun. initialize
  }//// fun. JobController

 })();
