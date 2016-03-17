/**
 * Created by Iyad Bitar on 02/29/2016.
 */
(function () {
    'use strict';

  angular.module('hirelyApp.layout').controller('BusinessMasterController', ['$scope', '$state', '$stateParams',BusinessMasterController])
  .directive("businessHeader", function() {
        return {
            restrict: 'A',
            templateUrl: 'app/layout/business/business-header.tpl.html',
            controller: 'BusinessHeaderController',
            scope: true,
            transclude : false
        };
    })

  function BusinessMasterController($scope, $http, $state, $stateParams) {

    $scope.showPositionMenu = false;


    $scope.togglePositionMenu = function(event){
      console.log('menu')
      var handleMenuClick = function(e){
          if(true === $scope.showPositionMenu){
              $scope.showPositionMenu = false;
              $scope.$apply();
              //// unbind when menu closed no need to check for click
              $('body').unbind('click', handleMenuClick);
          }
          else{
              $scope.showPositionMenu = true;
              $scope.$apply();
          }
      };
      /**
       * the event will bubble up to body so do the work on body click \ only if menu is closed
       * this to make sure the menu is closed when click outside the menu
       */
      if(false === $scope.showPositionMenu){
          $('body').bind('click', handleMenuClick);
      }
    }//// togglePositionMenu

  }//// fun. JobController

 })();
