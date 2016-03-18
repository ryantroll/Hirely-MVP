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



  }//// fun. JobController

 })();
