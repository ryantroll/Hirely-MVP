/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('ThankYouApplicationController', ['$rootScope', '$scope', ThankYouApplicationController]);


  function ThankYouApplicationController($rootScope, $scope) {
    function initialize(){
      $scope.name = $rootScope.currentUser.firstName;
    }
    initialize();

  }
})();
